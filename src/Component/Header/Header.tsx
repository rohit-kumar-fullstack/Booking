import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import colors from '../../Constant/Color';
import ImagePath from '../../Constant/ImagePath';
import FontsFamily from '../../Constant/FontsFamily';
import SideDrawer from '../SideDrawer/SideDrawer';

const { width } = Dimensions.get('window');

interface HeaderProps {
  title: string;
  showDrawer?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showDrawer = true }) => {
  const insets = useSafeAreaInsets();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <LinearGradient
        colors={[colors.white, 'rgba(255,255,255,0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.row}>
          <View style={styles.left}>
            {showDrawer && (
              <TouchableOpacity
                onPress={() => setDrawerVisible(true)}
                style={styles.drawerIcon}
                activeOpacity={0.7}
              >
                <Menu size={28} color={colors.black} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          <Image
            source={ImagePath.Icon.Logo2}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      {/* Drawer Modal */}
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width,
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    color: colors.black,
    fontFamily: FontsFamily.poppinsSemiBold,
  },
  logo: {
    width: 55,
    height: 55,
  },
});
