import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Modal from 'react-native-modal';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { X, Home, Gavel, FileText, User, LogOut, ChevronRight } from 'lucide-react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { removeToken } from '../../Redux/Slices/Token';
import NavigationString from '../../Constant/NavigationString';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

interface Props { visible: boolean; onClose: () => void; }

const SideDrawer: React.FC<Props> = ({ visible, onClose }) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const user = { name: 'Rohit Kumar', role: 'Procurement Manager', avatar: 'https://i.pravatar.cc/150?img=12', };
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    translateX.value = visible
      ? withTiming(0, { duration: 300 })
      : withTiming(-DRAWER_WIDTH, { duration: 250 });
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const menuItems = [
    {
      label: 'Home',
      icon: Home,
      onPress: () => navigation.navigate(NavigationString.Home),
    },
    {
      label: 'Auctions',
      icon: Gavel,
      onPress: () => navigation.navigate(NavigationString.Auction),
    },
    {
      label: 'Tenders',
      icon: FileText,
      onPress: () => navigation.navigate(NavigationString.Tender),
    },
    {
      label: 'Profile',
      icon: User,
      onPress: () => { },
    },
  ];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.45}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
      useNativeDriver
    >
      <Animated.View style={[styles.drawer, drawerStyle]}>
        {/* ================= Header / Profile ================= */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color="#111827" />
          </TouchableOpacity>

          <Image source={{ uri: user.avatar }} style={styles.avatar} />

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>

        {/* ================= Menu ================= */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            const itemStyle = useAnimatedStyle(() => ({
              opacity: withDelay(
                index * 80,
                withTiming(1, { duration: 300 }),
              ),
              transform: [
                {
                  translateX: withDelay(
                    index * 80,
                    withTiming(0, { duration: 300 }),
                  ),
                },
              ],
            }));

            return (
              <Animated.View key={item.label} style={itemStyle}>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    item.onPress();
                  }}
                >
                  <View style={styles.menuLeft}>
                    <Icon size={20} color="#1F2937" />
                    <Text style={styles.menuText}>{item.label}</Text>
                  </View>
                  <ChevronRight size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* ================= Logout ================= */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              dispatch(removeToken());
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: NavigationString.Login }],
                }),
              );
            }}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },

  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 12,
  },

  /* -------- Profile -------- */
  profileHeader: {
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
    paddingBottom: 24,
    alignItems: 'center',
    borderTopRightRadius: 24,
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 16,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  userRole: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  /* -------- Menu -------- */
  menuContainer: {
    paddingHorizontal: 14,
    paddingTop: 20,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  /* -------- Logout -------- */
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
