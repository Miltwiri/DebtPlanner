// jest.config.js

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Transform JavaScript files using Babel
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};
