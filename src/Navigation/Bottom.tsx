import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as LucideIcons from 'lucide-react-native';
import Screens from '../Screens';
import colors from '../Constant/Color';
import NavigationString from '../Constant/NavigationString';
import EditableExcel from '../Screens/Tender/Component/EditableExcel';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const TAB_BUTTON_WIDTH = width / 4;

const Tab = createBottomTabNavigator();

const TabButton = ({ route, isFocused, onPress }: any) => {
    const icons: Record<string, { outline: any; filled: any }> = {
        Home: { outline: "Home", filled: "Home" },
        Auction: { outline: "Gavel", filled: "Gavel" },
        Tender: { outline: "FileText", filled: "FileText" },
        EditableExcel: { outline: "FileText", filled: "FileText" },
    };
    const IconName = LucideIcons[isFocused ? icons[route.name].filled : icons[route.name].outline];
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isFocused) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(translateYAnim, {
                        toValue: -8,
                        duration: 120,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateYAnim, {
                        toValue: 0,
                        friction: 3,
                        tension: 80,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.spring(scaleAnim, {
                    toValue: 1.3,
                    friction: 5,
                    tension: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.6,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isFocused]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.tabButton, { width: TAB_BUTTON_WIDTH }]}
            activeOpacity={0.8}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                {IconName && (
                    <IconName
                        size={20}
                        color={isFocused ? colors.primary : '#888'}
                        strokeWidth={2}
                    />
                )}
            </Animated.View>

            <Text
                style={[
                    styles.label,
                    {
                        color: isFocused ? colors.primary : '#888',
                        fontWeight: isFocused ? '600' : '400',
                    },
                ]}
            >
                {route.name === 'BrandDay' ? 'Coupons' : route.name}
            </Text>
        </TouchableOpacity>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;

                return (
                    <TabButton
                        key={route.key}
                        route={route}
                        isFocused={isFocused}
                        onPress={() => navigation.navigate(route.name)}
                    />
                );
            })}
        </View>
    );
};

export default function BottomTab() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}
            >
                <Tab.Screen name="Home" component={Screens.Home} />
                <Tab.Screen name={NavigationString.Auction} component={Screens.Auction} />
                <Tab.Screen name={NavigationString.Tender} component={Screens.Tender} />
                <Tab.Screen name={'EditableExcel'} component={EditableExcel} />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBar: {
        flexDirection: 'row',
        height: TAB_BAR_HEIGHT,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 5,
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    iconContainer: {
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        textAlign: 'center',
        includeFontPadding: false,
    },
});
