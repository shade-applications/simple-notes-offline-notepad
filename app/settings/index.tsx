import { View, StyleSheet } from 'react-native';
import { Text, List, Switch, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const theme = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <List.Section>
                <List.Subheader>Appearance</List.Subheader>
                <List.Item
                    title="Dark Mode"
                    right={() => <Switch value={false} onValueChange={() => { }} />}
                />
                <List.Subheader>Security</List.Subheader>
                <List.Item
                    title="App Lock"
                    description="Protect your notes"
                    left={props => <List.Icon {...props} icon="lock" />}
                />
            </List.Section>
        </View>
    );
}
