import NavigationString from "../Constant/NavigationString";

export interface RootStackParamList {
    [NavigationString.Home]: undefined;
};



export interface CommonColors {
  appColourDark: string;
  appColourDarkDim: string;
  appColourLight: string;
  appColourLightDim: string;
  appRed: string;
  appYellow: string;
  appGreen: string;
  appGreenDark: string;
  appRedDark: string;
  white: string;
  black: string;
  black70: string;
  black90: string;
  black20: string;
  black50: string;
  black10: string;
  white90: string;
  white80: string;
}

export interface Theme extends CommonColors {
  theme: 'light' | 'dark';
  background: string;
  text: string;
  subText: string;
  inputBg: string;
  border: string;
  placeholder: string;
  buttonBg: string;
  buttonText: string;
  merchenthomeBg: string;
  primaryColor: string;
  iconColor: string;
  catagoryBg: string;
  gray: string;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  theme: Theme;
}


export interface CategoryItemType {
  buttonName: string;
  categoryDomain: string;
  categoryIcon: string;     // base64 or URL
  categoryId: string;
  categoryName: string;
  faqDetailsList: any[];    // you can type this later
  textArea: string;
}