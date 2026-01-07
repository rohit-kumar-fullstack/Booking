import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import colors from '../../Constant/Color';
import ImagePath from '../../Constant/ImagePath';
import { useNavigation } from '@react-navigation/native';
import FontsFamily from '../../Constant/FontsFamily';
import NavigationString from '../../Constant/NavigationString';

const { width } = Dimensions.get('window');

interface HeaderProps {
    title: string;
    showArrow?: boolean;
}

const InsideHeader: React.FC<HeaderProps> = ({ title, showArrow = false }) => {
    const navigation:any = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top - 10,
                },
            ]}
        >
            <View style={styles.row}>
                <View style={styles.leftRow}>
                    {showArrow && (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={26} color={colors.black} strokeWidth={2.5} />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.title}>{title}</Text>
                </View>

                <TouchableOpacity onPress={() => { navigation.navigate(NavigationString.Home) }}>
                    <Image
                        source={ImagePath.Icon.Logo2}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InsideHeader;

const styles = StyleSheet.create({
    container: {
        width,
        backgroundColor: colors.white, // IMPORTANT for shadow
        shadowColor: '#000',            // iOS shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
        zIndex: 10,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },

    title: {
        fontSize: 20,
        color: colors.black,
        fontFamily: FontsFamily.poppinsSemiBold,
    },

    logo: {
        height: 60,
        width: 60,
    },
});
