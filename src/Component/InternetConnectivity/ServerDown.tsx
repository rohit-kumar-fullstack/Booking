import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AlertCircle,
  Clock,
  Server,
  Calendar,
  RefreshCw,
  MessageCircle,
  Twitter,
  Activity,
  MessageSquare,
  Bell,
  WifiOff,
} from 'lucide-react-native';
import Colors from '../../Styles/Color';
import FontsFamily from '../../Constant/FontsFamily';

const {width} = Dimensions.get('window');

const ServerDown = () => {
  return (
    <>
      <StatusBar
        // translucent={true}
        // backgroundColor="transparent"
        barStyle="dark-content"
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Status Indicator */}
            <View style={styles.statusIndicator}>
              <View style={styles.statusPulse} />
              <View style={styles.statusDot}>
                <AlertCircle size={24} color="#FFF" />
              </View>
            </View>

            {/* Animated Illustration */}
            <View style={styles.animationContainer}>
              <LottieView
                source={require('../../lottie/MaintenanceServer.json')}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Server Unavailable</Text>

              <View style={styles.statusMessage}>
                <Clock size={18} color="#FF6B6B" style={styles.statusIcon} />
                <Text style={styles.statusText}>
                  Temporarily down for maintenance
                </Text>
              </View>

              <Text style={styles.description}>
                Our servers are currently undergoing maintenance. This usually
                takes 15-30 minutes. We appreciate your patience while we work
                to improve your experience.
              </Text>

              {/* Action Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {}}
                  style={styles.touchable}>
                  <LinearGradient
                    colors={[Colors.appColourDark, Colors.appColourDarkDim]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.primaryButton}>
                    <RefreshCw
                      size={20}
                      color="#FFF"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.primaryButtonText}>Refresh Status</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Live Status */}
              <View style={styles.liveStatus}>
                <View style={styles.liveIndicator}>
                  <View style={styles.livePulse} />
                  <View style={styles.liveDot} />
                </View>
                <Activity size={14} color="#10B981" style={styles.liveIcon} />
                <Text style={styles.liveText}>Monitoring server status...</Text>
              </View>
            </View>
          </View>

          {/* Background Pattern */}
          <View style={styles.backgroundPattern} />
        </View>
      </ScrollView>
    </>
  );
};

export default ServerDown;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: Dimensions.get('window').height,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: Colors.appColourDark,
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 2,
  },
  statusIndicator: {
    position: 'absolute',
    top: -20,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.appColourDark,
    opacity: 0.2,
  },
  statusDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.appColourDarkDim,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.appColourDark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  animation: {
    width: '100%',
    height: '100%',
    marginLeft: -20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#C53030',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 8,
    fontFamily: FontsFamily.poppinsMedium,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EDF2FE',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 12,
    marginRight: 8,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
  },
  statusMaintenance: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#D6BCFA',
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  touchable: {
    width: '100%',
    shadowColor: '#FF6B6B',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicator: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  livePulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    opacity: 0.4,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  liveIcon: {
    marginRight: 6,
  },
  liveText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAFF',
    opacity: 0.3,
    zIndex: 1,
  },
});
