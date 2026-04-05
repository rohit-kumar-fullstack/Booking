import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import ImagePath from '../../Constant/ImagePath';
import NavigationString from '../../Constant/NavigationString';
import colors from '../../Constant/Color';
import FontsFamily from '../../Constant/FontsFamily';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mmkvStorage } from '../../Utils/Storage/Storage';
const { width } = Dimensions.get('window');
const slides = [
    {
        id: 1,
        title: 'Welcome',
        description: 'Discover a smarter way to manage your work and stay productive every day.',
        Image: ImagePath.OnBoard1,
    },
    {
        id: 2,
        title: 'Stay Organized',
        description: 'Keep all your tasks, updates, and important information in one place.',
        Image: ImagePath.OnBoard2,
    },
    {
        id: 3,
        title: 'Real-Time Updates',
        description: 'Get instant updates and notifications so you never miss anything important.',
        Image: ImagePath.OnBoard3,
    },
    {
        id: 4,
        title: 'Get Started',
        description: 'Let’s begin your journey and explore all the powerful features of the app.',
        Image: ImagePath.OnBoard3,
    },
];

const Onboarding = () => {
    const Navigation: any = useNavigation()

    const onFinish = async () => {
        mmkvStorage.setItem('onBoarding', 'true');
        Navigation.navigate(NavigationString.Login)
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.slide}>
            <item.Image />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    const renderNextButton = () => (
        <View style={styles.btnCircle}>
            <Text style={styles.btnText}>Next</Text>
        </View>
    );

    const renderPrevButton = () => (
        <View style={styles.btnCircle}>
            <Text style={styles.btnText}>Prev</Text>
        </View>
    );

    // ✅ Done Button
    const renderDoneButton = () => (
        <TouchableOpacity style={styles.btnCircle} onPress={onFinish}>
            <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
    );

    return (
        <AppIntroSlider
            data={slides}
            renderItem={renderItem}
            showSkipButton
            showPrevButton
            renderNextButton={renderNextButton}
            renderPrevButton={renderPrevButton}
            renderDoneButton={renderDoneButton}
            onSkip={onFinish}
            onDone={onFinish}
            activeDotStyle={styles.activeDot}
            dotStyle={styles.dot}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    image: {
        width: width * 0.75,
        height: width * 0.75,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontFamily: FontsFamily.poppinsBold,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        fontFamily: FontsFamily.poppinsRegular,
        color: colors.grayText,
        textAlign: 'center',
        lineHeight: 22,
    },
    dot: {
        backgroundColor: colors.border,
    },
    activeDot: {
        backgroundColor: colors.primary,
        width: 22,
    },
    btnCircle: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.primary,
        borderRadius: 20,
        width: 80
    },
    btnText: {
        color: colors.white,
        fontFamily: FontsFamily.poppinsMedium,
        textAlign: 'center'
    },
    doneBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: colors.primary,
        borderRadius: 24,
    },
    doneText: {
        color: colors.white,
        fontFamily: FontsFamily.poppinsMedium,
        textAlign: 'center'
    },
});
