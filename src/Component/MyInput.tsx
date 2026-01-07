import { StyleSheet, TextInput, View, TextInputProps, StyleProp, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import React, { ReactNode } from 'react';
import Icon from 'lucide-react-native';

type MyInputProps = {
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isVarify?: boolean;
  maxlength?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  editable?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  rightIcon?: string,
  rightIconPress?:()=>void
} & TextInputProps;

const MyInput: React.FC<MyInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  isVarify,
  maxlength,
  onFocus,
  onBlur,
  focused,
  keyboardType,
  editable = true,
  autoCapitalize,
  rightIcon,
  rightIconPress,
  ...textInputProps
}) => {
  return (
    <View
      style={[
        styles.inputWrapper,
        focused && styles.inputFocused,
        !editable && styles.inputDisabled,
      ]}
    >
      {/* <Icon
        name={icon}
        size={18}
        color={focused ? "#0000" : '#aaa'}
        style={styles.icon}
      /> */}
      <TextInput
        {...textInputProps}
        placeholder={placeholder}
        style={[styles.input, !editable && { color: '#999' }]}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        maxLength={maxlength}
        editable={editable}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {
        rightIcon ?
          <TouchableOpacity onPress={rightIconPress}>
           {/* <Icon
            name={rightIcon}
            size={18}
            color={focused ? color.primary : '#aaa'}
            style={styles.icon}
          /> */}
          </TouchableOpacity>

          : null}
      {/* {isVarify ? (
        <Icon
          name="check-circle"
          size={18}
          color={color.success}
          style={styles.icon}
        />
      ) : null} */}
    </View>
  );
};

export default MyInput;
const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 55,
    
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    paddingVertical: 0,
  },
  inputFocused: {
    borderColor: '#007BFF',
  },
  inputDisabled: {
    backgroundColor: '#f2f2f2',
  },
});
