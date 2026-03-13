import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import colors from '../../Constant/Color';
import { Phone } from 'lucide-react-native';
const HelpSupport = () => {
  // const [activeFaq, setActiveFaq] = useState(null);

  // const handleSubmit = () => {
  //     if (!suggestion.trim()) {
  //         Alert.alert('Error', 'Please enter your suggestion');
  //         return;
  //     }
  //     setSuggestion('');
  // };

  const callSupport = () => {
    Alert.alert('Call Support', 'Would you like to call our support team?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Call',
        onPress: () => Linking.openURL('tel:9897004181'),
      },
    ]);
  };

  // const toggleFaq = (id: any) => {
  //     setActiveFaq(activeFaq === id ? null : id);
  // };

  return (
    <View
      testID="wrapper"
      style={{flex: 1, paddingTop: 35, backgroundColor: colors.white}}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Phone  size={32} color="#4a6fa5" />
          <Text style={styles.headerText}>Help & Support</Text>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Phone  size={20} color="#4a6fa5" />
            <Text style={styles.cardTitle}>Contact Support</Text>
          </View>
          <Text style={styles.cardText}>
            Our team is available 24/7 to help with any questions or issues.
          </Text>
          <TouchableOpacity
            testID="call_support"
            style={styles.callButton}
            onPress={callSupport}
          >
            {/* <Icon name="call-outline" size={18} color="white" /> */}
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>

      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#4a6fa5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  faqItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
    paddingLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#4a6fa5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f0fff0',
    borderRadius: 6,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginLeft: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionButtonText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
});

export default HelpSupport;
