import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import LinearGradient from "react-native-linear-gradient";

const InternetConnectivity = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.lottieContainer}>
          <LottieView
            source={require("../../lottie/NoInternet.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>No Internet Connection</Text>
          
          <Text style={styles.subtitle}>
            It looks like you're offline. Check your connection and try again to continue.
          </Text>
          
          <View style={styles.hintContainer}>
            <View style={styles.hintRow}>
              <View style={styles.hintDot} />
              <Text style={styles.hintText}>Check your Wi-Fi or mobile data</Text>
            </View>
            <View style={styles.hintRow}>
              <View style={styles.hintDot} />
              <Text style={styles.hintText}>Try turning airplane mode on/off</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => {}}
            style={styles.touchable}
          >
            <LinearGradient
              colors={["#63adde", "#3089bd50"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InternetConnectivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#667EEA",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  lottieContainer: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 8,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 10,
    fontWeight: "400",
  },
  hintContainer: {
    width: "100%",
    backgroundColor: "#F8F9FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#EDF2FE",
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#667EEA",
    marginRight: 12,
  },
  hintText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "400",
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  touchable: {
    width: "100%",
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryBtn: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  retryText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFF",
    width: "100%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});