import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';
import { addBooking } from '../Redux/Slices/Booking';
import moment from 'moment';
import { showSuccessAlert } from '../Constant/ShowDailog';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { height } = Dimensions.get('window');

const SERVICES = [
    { label: 'Hotel Booking', value: 'hotel' },
    { label: 'Cab Service', value: 'cab' },
    { label: 'Resort Booking', value: 'resort' },
    { label: 'Flight Booking', value: 'flight' },
];

const BookingCreateModal = ({ visible, onClose }: any) => {
    const slideAnim = useRef(new Animated.Value(height)).current;
    const [openDate, setOpenDate] = useState(false);
    const Dispatch = useDispatch();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : height,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const BookingSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        service: Yup.string().required('Service is required'),
        date: Yup.date().required('Date is required'),
    });

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

                    <Formik
                        initialValues={{ name: '', service: '', date: new Date() }}
                        validationSchema={BookingSchema}
                        onSubmit={(values, { resetForm }) => {
                            const randomId = Math.floor(100000 + Math.random() * 900000).toString();
                            Dispatch(
                                addBooking({
                                    id: randomId,
                                    name: values.name,
                                    date: moment(values.date).format('MMMM Do, YYYY'),
                                    service: values.service,
                                })
                            );
                            showSuccessAlert('Booking created successfully');
                            resetForm();
                            onClose();
                        }}
                    >
                        {({ handleChange, handleSubmit, values, setFieldValue, errors, touched, isValid }) => (
                            <View style={styles.form}>
                                <TextInput
                                    placeholder="Customer name"
                                    placeholderTextColor="#9CA3AF"
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    style={styles.input}
                                />
                                {errors.name && touched.name && (
                                    <Text style={styles.error}>{errors.name}</Text>
                                )}

                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setOpenDate(true)}
                                >
                                    <Text style={styles.dateText}>{values.date.toDateString()}</Text>
                                </TouchableOpacity>
                                {errors.date && touched.date && (
                                    <Text style={styles.error}>{errors.date}</Text>
                                )}

                                <Dropdown
                                    style={styles.dropdown}
                                    containerStyle={styles.dropdownContainer}
                                    data={SERVICES}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select service"
                                    value={values.service}
                                    onChange={item => setFieldValue('service', item.value)}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                />
                                {errors.service && touched.service && (
                                    <Text style={styles.error}>{errors.service}</Text>
                                )}

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[styles.button, { opacity: isValid ? 1 : 0.5 }]}
                                    onPress={handleSubmit as any}
                                    disabled={!isValid}
                                >
                                    <Text style={styles.buttonText}>Create Booking</Text>
                                </TouchableOpacity>

                                <DatePicker
                                    modal
                                    open={openDate}
                                    date={values.date}
                                    mode="date"
                                    onConfirm={d => {
                                        setOpenDate(false);
                                        setFieldValue('date', d);
                                    }}
                                    onCancel={() => setOpenDate(false)}
                                />
                            </View>
                        )}
                    </Formik>
                </SafeAreaView>
            </Animated.View>
        </Modal>
    );
};

export default BookingCreateModal;

const styles = StyleSheet.create({
    modal: { margin: 0 },
    wrapper: { flex: 1, backgroundColor: '#F9FAFB' },
    safe: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: { fontSize: 20, fontWeight: '700', color: '#065F46' },
    close: { fontSize: 22, color: '#6B7280' },
    form: { padding: 20, gap: 16 },
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
    dateText: { fontSize: 15, color: '#111827' },
    dropdown: {
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dropdownContainer: { borderRadius: 12 },
    placeholder: { color: '#9CA3AF', fontSize: 15 },
    selectedText: { color: '#111827', fontSize: 15 },
    button: {
        marginTop: 10,
        backgroundColor: '#10B981',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    error: { color: 'red', fontSize: 12, marginTop: 4 },
});
