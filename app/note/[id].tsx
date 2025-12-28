import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TextInput, BackHandler, ScrollView } from 'react-native';
import { Appbar, useTheme, IconButton, Menu, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { NoteRepository, Note } from '@/db/NoteRepository';
import { Colors } from '@/constants/Colors';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ColorPickerModal from '@/components/ColorPickerModal';

export default function NoteEditor() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const db = useSQLiteContext();
    const theme = useTheme();
    const router = useRouter();
    const navigation = useNavigation();

    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [noteColor, setNoteColor] = useState<string | null>(null);
    const [isPinned, setIsPinned] = useState(0);
    const [isLocked, setIsLocked] = useState(0);
    const [lastSaved, setLastSaved] = useState<number>(Date.now());
    const [isLoading, setIsLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);

    // Constants
    const noteId = id || Date.now().toString(); // Use param ID or generate new (safer to rely on param)

    // Refs for debounce
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstLoad = useRef(true);

    // Load Note
    useEffect(() => {
        async function loadNote() {
            if (!id) return;
            try {
                const existingNote = await NoteRepository.getNote(db, id);
                if (existingNote) {
                    setTitle(existingNote.title);
                    setContent(existingNote.content);
                    setNoteColor(existingNote.color_hex || null);
                    setIsPinned(existingNote.is_pinned);
                    setIsLocked(existingNote.is_locked);
                    setLastSaved(existingNote.updated_at);
                }
            } catch (e) {
                console.error("Error loading note", e);
            } finally {
                setIsLoading(false);
                isFirstLoad.current = false;
            }
        }
        loadNote();
    }, [id, db]);

    // Auto-Save Logic
    const saveNote = useCallback(async (currentTitle: string, currentContent: string, currentColor?: string | null) => {
        if (isFirstLoad.current) return; // Don't save on initial render

        const colorToSave = currentColor !== undefined ? currentColor : noteColor;

        try {
            const now = Date.now();
            const existing = await NoteRepository.getNote(db, noteId);

            if (existing) {
                await NoteRepository.updateNote(db, noteId, {
                    title: currentTitle,
                    content: currentContent,
                    color_hex: colorToSave || undefined,
                    updated_at: now
                });
            } else {
                // Create new
                const newNote: Note = {
                    id: noteId,
                    title: currentTitle,
                    content: currentContent,
                    created_at: now,
                    updated_at: now,
                    is_pinned: isPinned,
                    is_archived: 0,
                    is_locked: isLocked,
                    is_deleted: 0,
                    color_hex: colorToSave || undefined
                };
                await NoteRepository.createNote(db, newNote);
            }
            setLastSaved(now);
        } catch (e) {
            console.error("Failed to save note", e);
        }
    }, [db, noteId, isPinned, isLocked, noteColor]);

    // Debounce Wrapper
    const handleContentChange = (text: string) => {
        setContent(text);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            saveNote(title, text);
        }, 1000); // Auto-save after 1s of inactivity
    };

    const handleTitleChange = (text: string) => {
        setTitle(text);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            saveNote(text, content);
        }, 1000);
    };

    // Back Handler
    useEffect(() => {
        const backAction = () => {
            // ensure save without explicit debounce
            router.back();
            saveNote(title, content);
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [title, content, saveNote]);


    const togglePin = async () => {
        const newVal = isPinned ? 0 : 1;
        setIsPinned(newVal);
        await NoteRepository.updateNote(db, noteId, { is_pinned: newVal });
    };

    const deleteNote = async () => {
        await NoteRepository.deleteNote(db, noteId);
        router.back();
    };

    const shareNote = async () => {
        try {
            const fileUri = FileSystem.cacheDirectory + 'note.txt';
            await FileSystem.writeAsStringAsync(fileUri, `${title}\n\n${content}`);
            await Sharing.shareAsync(fileUri);
        } catch (e) {
            console.error("Share failed", e);
        }
    };

    const currentBackgroundColor = noteColor
        ? noteColor
        : theme.dark ? theme.colors.background : theme.colors.surface;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentBackgroundColor, paddingBottom: 0 }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => { saveNote(title, content); router.back(); }} />
                <View style={{ flex: 1 }} />
                <IconButton
                    icon={isPinned ? "pin" : "pin-outline"}
                    iconColor={isPinned ? theme.colors.primary : theme.colors.onSurface}
                    onPress={togglePin}
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}>
                    <Menu.Item onPress={shareNote} title="Share" leadingIcon="share-variant" />
                    <Menu.Item onPress={() => { }} title="Lock" leadingIcon="lock-outline" />
                    <Divider />
                    <Menu.Item onPress={deleteNote} title="Delete" leadingIcon="delete" titleStyle={{ color: theme.colors.error }} />
                </Menu>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <TextInput
                    placeholder="Title"
                    placeholderTextColor={theme.colors.onSurfaceVariant}
                    style={[styles.titleInput, { color: theme.colors.onSurface }]}
                    value={title}
                    onChangeText={handleTitleChange}
                    maxLength={100}
                />
                <TextInput
                    placeholder="Start writing..."
                    placeholderTextColor={theme.colors.onSurfaceDisabled}
                    style={[styles.contentInput, { color: theme.colors.onSurface }]}
                    multiline
                    textAlignVertical="top"
                    value={content}
                    onChangeText={handleContentChange}
                />
            </ScrollView>

            {/* Footer / Toolbar */}
            <View style={[styles.footer, { backgroundColor: theme.colors.elevation.level2 }]}>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    {content.length} chars
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="palette-outline"
                        size={20}
                        onPress={() => setColorPickerVisible(true)}
                    />
                </View>
            </View>

            <ColorPickerModal
                visible={colorPickerVisible}
                onDismiss={() => setColorPickerVisible(false)}
                selectedColor={noteColor}
                onSelectColor={(color) => {
                    setNoteColor(color);
                    saveNote(title, content, color); // Explicitly save color
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        height: 56,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    contentInput: {
        fontSize: 16,
        lineHeight: 24,
        minHeight: 200,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    }
});
