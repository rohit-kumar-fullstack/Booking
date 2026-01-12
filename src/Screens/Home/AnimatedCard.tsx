import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Animated, StatusBar, TouchableOpacity, RefreshControl } from 'react-native';
import { Header } from '../../Component/Index';
import BookingStyle from './HomeStyle';
import { Plus, Trash } from 'lucide-react-native';
import BookingCreateModal from '../../Modals/BookingCreateModal';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../Constant/Color';
import { removeBooking } from '../../Redux/Slices/Booking';
import { showSuccessAlert } from '../../Constant/ShowDailog';

const AnimatedCard = ({ item, index }: any) => {
    const translateY = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.95)).current;
    const dispatch = useDispatch();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 450,
                delay: index * 120,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 450,
                delay: index * 120,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 7,
                delay: index * 120,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                BookingStyle.cardWrapper,
                { opacity, transform: [{ translateY }, { scale }] },
            ]}
        >
            <View style={BookingStyle.accent} />

            <View style={BookingStyle.cardContent}>
                <View style={BookingStyle.topRow}>
                    <Text style={BookingStyle.name}>{item.name}</Text>
                    <View style={BookingStyle.badge}>
                        <Text style={BookingStyle.badgeText}>{item.service}</Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                    }}
                >
                    <View style={BookingStyle.bottomRow}>
                        <Text style={BookingStyle.dateLabel}>Booking Date</Text>
                        <Text style={BookingStyle.date}>{item.date}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => {
                            dispatch(removeBooking(item.id));
                            showSuccessAlert('Booking deleted successfully');
                        }}
                    >
                        <Trash size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

export default AnimatedCard;