import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, Chip, useTheme, Card, IconButton } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import AdBanner from '@/components/AdBanner'; // We'll create this next

type Note = {
    id: string;
    title: string;
    content: string;
    color_hex?: string;
    is_pinned: number;
    updated_at: number;
};

export default function HomeScreen() {
    const db = useSQLiteContext();
    const theme = useTheme();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pinned' | 'work' | 'personal'>('all'); // Simplified for now

    const fetchNotes = useCallback(async () => {
        try {
            // Basic query - can be optimized
            // Note: In real app, we'd use parameterized queries for search
            let query = `
        SELECT id, title, content, color_hex, is_pinned, updated_at 
        FROM notes 
        WHERE is_deleted = 0 
      `;

            const params: any[] = [];

            if (searchQuery) {
                query += ` AND (title LIKE ? OR content LIKE ?)`;
                params.push(`%${searchQuery}%`, `%${searchQuery}%`);
            }

            if (filter === 'pinned') {
                query += ` AND is_pinned = 1`;
            }
            // Add folder logic later

            query += ` ORDER BY is_pinned DESC, updated_at DESC`;

            const result = await db.getAllAsync<Note>(query, params);
            setNotes(result);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    }, [db, searchQuery, filter]);

    useFocusEffect(
        useCallback(() => {
            fetchNotes();
        }, [fetchNotes])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotes();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Note }) => (
        <Card
            style={[styles.card, { backgroundColor: item.color_hex || theme.colors.surface }]}
            onPress={() => router.push(`/note/${item.id}`)}
            mode="contained"
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1, fontWeight: item.title ? 'bold' : 'normal' }}>
                        {item.title || 'Untitled'}
                    </Text>
                    {item.is_pinned === 1 && (
                        <IconButton icon="pin" size={16} iconColor={theme.colors.primary} />
                    )}
                </View>
                <Text variant="bodyMedium" numberOfLines={3} style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.content}
                </Text>
                <Text variant="labelSmall" style={{ marginTop: 8, color: theme.colors.outline }}>
                    {new Date(item.updated_at).toLocaleDateString()}
                </Text>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Simple Notes</Text>
                <IconButton icon="cog" onPress={() => router.push('/settings')} />
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    elevation={0}
                />
            </View>

            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text variant="bodyLarge">No notes found.</Text>
                        <Text variant="bodySmall">Tap + to create one.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push(`/note/${Date.now().toString()}`)} // Temporary ID generation
                label="New Note"
            />

            <View style={styles.adContainer}>
                <AdBanner />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    title: {
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBar: {
        backgroundColor: 'rgba(100, 100, 100, 0.1)',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 64,
        opacity: 0.6,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 60, // Above AdBanner
    },
    adContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    }
});
