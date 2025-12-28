import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Appbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoteEditor() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Edit Note" />
                <Appbar.Action icon="content-save" onPress={() => { }} />
            </Appbar.Header>
            <View style={{ padding: 16 }}>
                <Text variant="headlineSmall">Note ID: {id}</Text>
                <TextInput
                    mode="flat"
                    placeholder="Title"
                    style={{ backgroundColor: 'transparent', fontSize: 24, fontWeight: 'bold' }}
                    underlineColor="transparent"
                />
                <TextInput
                    mode="flat"
                    placeholder="Start writing..."
                    multiline
                    style={{ backgroundColor: 'transparent', minHeight: 200 }}
                    underlineColor="transparent"
                />
            </View>
        </SafeAreaView>
    );
}
