// jest.config.js

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Transform JavaScript files using Babel
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native-firebase/firestore|@react-native(-community)?)/)'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};
