module.exports = {
  presets: [
    'module:@react-native/babel-preset',
  ],
  plugins: ['react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/Component', // match folder name exactly
          '@screens': './src/Screens',
        },
      },
    ],
  ],
};
