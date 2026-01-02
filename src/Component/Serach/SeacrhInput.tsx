import { Filter, Search } from "lucide-react-native";
import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolateColor
} from "react-native-reanimated";
import colors from "../../Constant/Color";

export interface SearchType {
    placeholder?: string;
    onChange: (value: string) => void;
    label?: string;
    filter?: boolean;
    filterPress?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const SearchInput: React.FC<SearchType> = ({
    placeholder,
    onChange,
    label,
    filter = true,
    filterPress
}) => {
    const isFocused = useSharedValue(0);

    // Animate border color and shadow based on focus
    const inputContainerStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            isFocused.value,
            [0, 1],
            [colors.grayText + '50', colors.grayText] // Assuming colors.primary exists
        );

        return {
            borderColor: borderColor,
            borderWidth: withTiming(isFocused.value ? 1.5 : 1),
            transform: [{ scale: withTiming(isFocused.value ? 1.01 : 1) }],
            shadowOpacity: withTiming(isFocused.value ? 0.1 : 0),
        };
    });

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.row}>
                <AnimatedView style={[styles.inputWrapper, inputContainerStyle]}>
                    <Search
                        size={18}
                        color={isFocused.value ? colors.grayText : colors.grayText}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        onChangeText={onChange}
                        placeholderTextColor={colors.grayText}
                        onFocus={() => (isFocused.value = withTiming(1))}
                        onBlur={() => (isFocused.value = withTiming(0))}
                        selectionColor={colors.grayText}
                    />
                </AnimatedView>

                {filter && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.filterButton}
                        onPress={filterPress}
                    >
                        <Filter size={22} color={colors.black} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: colors.black,
        letterSpacing: 0.3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        // Elevation for Android
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: colors.black,
        paddingVertical: Platform.OS === 'ios' ? 0 : 8,
    },
    filterButton: {
        height: 48,
        width: 48,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.grayText + '30',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    }
});