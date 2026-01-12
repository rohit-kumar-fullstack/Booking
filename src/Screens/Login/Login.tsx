import React, { useState } from 'react';
import { View, Text, Dimensions, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import colors from '../../Constant/Color';
import { useNavigation, CommonActions } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Loader } from '../../Component/Index';
import FontsFamily from '../../Constant/FontsFamily';
import NavigationString from '../../Constant/NavigationString';
import { useDispatch } from 'react-redux';
import { setToken } from '../../Redux/Slices/Token';
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};
const { height, width } = Dimensions.get('window');

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

const Login = () => {
  const Navigation: any = useNavigation()
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const Dispatch = useDispatch();
  const HandleLogin = async (values: any) => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      Dispatch(setToken({ token: 'dummy-auth-token' }));
      Navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: NavigationString.Home }],
        })
      );
    }, 1500);

  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>

          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight || '#4c669f']}
              style={styles.gradient}
            >
              <Animated.Text
                entering={FadeInDown.delay(200).duration(800)}
                style={styles.logo}
              >
                Add  Logo
              </Animated.Text>
            </LinearGradient>
          </View>

          <Animated.View
            entering={FadeInUp.springify().damping(15)}
            style={styles.formContainer}
          >
            <View style={styles.sheetHandle} />

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your details to access your account</Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                HandleLogin(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={{}}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[styles.inputWrapper, touched.email && errors.email && styles.inputError]}>
                    <Mail size={20} color={touched.email && !errors.email ? colors.primary : colors.grayText} />
                    <TextInput
                      placeholder="name@example.com"
                      placeholderTextColor="#A0A0A0"
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                  </View>
                  {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
                  <View style={[styles.inputWrapper, touched.password && errors.password && styles.inputError]}>
                    <Lock size={20} color={touched.password && !errors.password ? colors.primary : colors.grayText} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#A0A0A0"
                      style={styles.input}
                      secureTextEntry={!passwordVisible}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? <EyeOff size={20} color={colors.grayText} /> : <Eye size={20} color={colors.grayText} />}
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TouchableOpacity style={styles.forgotPass}>
                    <Text style={styles.forgotPassText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
                      handleSubmit();
                    }}

                    style={styles.buttonShadow}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.primaryLight || '#4c669f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      {
                        loading ? <Loader color={colors.white} size='small' /> : <>
                          <Text style={styles.buttonText}>Sign In</Text>
                          <ArrowRight size={20} color={colors.white} style={{ marginLeft: 8, marginTop: 5 }} /></>
                      }
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: height * 0.35,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
  },
  logo: {
    fontSize: 32,
    color: colors.black,
    fontFamily: FontsFamily.poppinsSemiBold
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: -40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 28,
    paddingTop: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#7C7C7C',
    marginTop: 6,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    paddingHorizontal: 16,
    height: 58,
  },
  inputError: {
    borderColor: '#FF5252',
    backgroundColor: '#FFF8F8',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 12,
    fontWeight: '500',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
  },
  forgotPassText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    color: '#7C7C7C',
    fontSize: 15,
  },
  signUpText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default Login;