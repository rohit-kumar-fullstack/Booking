import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Headset, Heart, ShoppingCart, Menu, Bell } from 'lucide-react-native';
import colors from '../../Constant/Color';
import MainStyle from '../../Styles/MainStyle';
import SearchButton from '../../Screens/Home/Component/SearchButton';
import { useNavigation } from '@react-navigation/native';
import NavigationString from '../../Constant/NavigationString';
import { Badge } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Animated, { useAnimatedStyle, interpolate, Extrapolate, useDerivedValue, withTiming, Easing } from 'react-native-reanimated';

const HEADER_HEIGHT = 100;

const Header = ({ scrollY }: any) => {
  const insets = useSafeAreaInsets();
  const Navigation: any = useNavigation();

  const cartProducts = useSelector((state: any) => state.cart.cartProducts);

  const cartCount = Object.keys(cartProducts).length;

  const smoothProgress = useDerivedValue(() => {
    const raw = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return withTiming(raw, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  });

  const bigHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -smoothProgress.value * HEADER_HEIGHT,
        },
        {
          scale: 1 - smoothProgress.value * 0.05,
        },
      ],
      opacity: interpolate(
        smoothProgress.value,
        [0, 0.7],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const compactHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            smoothProgress.value,
            [0, 1],
            [-60, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        smoothProgress.value,
        [0.4, 1],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <View>

      {/*BIG*/}
      <Animated.View
        style={[
          styles.bigHeader,
          bigHeaderStyle,
        ]}
      >
        <LinearGradient
          colors={['#0F766E', '#f4fffd']}
          style={{ flex: 1, justifyContent: 'center', paddingTop: insets.top }}
        >
          <View style={MainStyle.flexBetween}>
            <SearchButton onPress={() => { }} />

            <View style={styles.rightIcons}>
              <TouchableOpacity
                onPress={() =>
                  Navigation.navigate(NavigationString.HelpSupport)
                }>
                <Headset size={24} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Navigation.navigate(NavigationString.WishListProduct)
                }>
                <Heart size={24} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Navigation.navigate(NavigationString.Cart)}>
                <ShoppingCart size={24} color={colors.black} />
                {cartCount > 0 && (
                  <Badge style={styles.badge}>{cartCount}</Badge>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/*COMPACT*/}

      <Animated.View
        style={[
          styles.compactHeader,
          compactHeaderStyle,
        ]}
      >
        <LinearGradient
          colors={['#0F766E', '#f9f9f9']}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <View style={MainStyle.flexBetween}>

            {/* Left */}
            <TouchableOpacity onPress={() => { }}>
              <Menu size={26} color={colors.black} />
            </TouchableOpacity>

            {/* Right */}
            <View style={styles.rightIcons}>
              <TouchableOpacity>
                <Bell size={22} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Navigation.navigate(NavigationString.WishListProduct)
                }>
                <Heart size={22} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Navigation.navigate(NavigationString.Cart)}>
                <ShoppingCart size={22} color={colors.black} />
                {cartCount > 0 && (
                  <Badge style={styles.badge}>{cartCount}</Badge>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

      </Animated.View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  bigHeader: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  compactHeader: {
    position: 'absolute',
    height: 100,
    width: '100%',
    justifyContent: 'center',
  },
  rightIcons: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: colors.primary,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
});