import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';
import { addBooking } from '../Redux/Slices/Booking';
import moment from 'moment';
import { showSuccessAlert } from '../Constant/ShowDailog';
const { height } = Dimensions.get('window');

const SERVICES = [
    { label: 'Hotel Booking', value: 'hotel' },
    { label: 'Cab Service', value: 'cab' },
    { label: 'Resort Booking', value: 'resort' },
    { label: 'Flight Booking', value: 'flight' },
];

const BookingCreateModal = ({ visible, onClose }: any) => {
    const slideAnim = useRef(new Animated.Value(height)).current;
    const [name, setName] = useState('');
    const [service, setService] = useState<string | null>(null);
    const [date, setDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const Dispatch = useDispatch()

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : height,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const handleSubmit = () => {
        const randomId = Math.floor(100000 + Math.random() * 900000).toString();
        Dispatch(
            addBooking({
                id: randomId,
                name,
                date: moment(date).format('MMMM Do, YYYY'),
                service: service || '',
            })
        );
        showSuccessAlert('Booking created successfully');
        setName('');
        setService(null);
        setDate(new Date());
        onClose();
    };

    return (
        <Modal
            isVisible={visible}
            style={styles.modal}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.35}
            useNativeDriver
        >
            <Animated.View style={[styles.wrapper, { transform: [{ translateY: slideAnim }] }]}>
                <SafeAreaView style={styles.safe}>
                    <View style={styles.header}>
                        <Text style={styles.title}>New Booking</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            placeholder="Customer name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />

                        <TouchableOpacity style={styles.input} onPress={() => setOpenDate(true)}>
                            <Text style={styles.dateText}>{date.toDateString()}</Text>
                        </TouchableOpacity>

                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            data={SERVICES}
                            labelField="label"
                            valueField="value"
                            placeholder="Select service"
                            value={service}
                            onChange={item => setService(item.value)}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Create Booking</Text>
                        </TouchableOpacity>
                    </View>

                    <DatePicker
                        modal
                        open={openDate}
                        date={date}
                        mode="date"
                        onConfirm={d => {
                            setOpenDate(false);
                            setDate(d);
                        }}
                        onCancel={() => setOpenDate(false)}
                    />
                </SafeAreaView>
            </Animated.View>
        </Modal>
    );
};

export default BookingCreateModal;

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    safe: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#065F46',
    },
    close: {
        fontSize: 22,
        color: '#6B7280',
    },
    form: {
        padding: 20,
        gap: 16,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateText: {
        fontSize: 15,
        color: '#111827',
    },
    dropdown: {
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dropdownContainer: {
        borderRadius: 12,
    },
    placeholder: {
        color: '#9CA3AF',
        fontSize: 15,
    },
    selectedText: {
        color: '#111827',
        fontSize: 15,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#10B981',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
