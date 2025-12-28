import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Colors } from '@/constants/Colors';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    onSelectColor: (color: string | null) => void;
    selectedColor: string | null;
};

const PALETTE = [
    { name: 'Default', value: null }, // Null means theme default
    { name: 'Red', value: Colors.tags.red },
    { name: 'Orange', value: Colors.tags.orange },
    { name: 'Yellow', value: Colors.tags.yellow },
    { name: 'Green', value: Colors.tags.green },
    { name: 'Blue', value: Colors.tags.blue },
    { name: 'Purple', value: Colors.tags.purple },
];

export default function ColorPickerModal({ visible, onDismiss, onSelectColor, selectedColor }: Props) {
    const theme = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
            <TouchableWithoutFeedback onPress={onDismiss}>
                <View style={styles.overlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level3 }]}>
                        <Text variant="titleMedium" style={{ marginBottom: 16 }}>Note Color</Text>
                        <View style={styles.grid}>
                            {PALETTE.map((color) => (
                                <TouchableOpacity
                                    key={color.name}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: color.value || theme.colors.surface },
                                        selectedColor === color.value && styles.selected
                                    ]}
                                    onPress={() => {
                                        onSelectColor(color.value);
                                        onDismiss();
                                    }}
                                >
                                    {selectedColor === color.value && <View style={styles.dot} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 24,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
    },
    colorCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    selected: {
        borderWidth: 2,
        borderColor: '#000', // Or theme primary
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
        opacity: 0.5,
    }
});
