import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthProvider, AuthContext } from './AuthContext'; // Make sure to import your AuthProvider and AuthContext from the correct location

// Mock the functions from @react-native-firebase/auth and @react-native-firebase/firestore as they are external dependencies
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'user123' } }),
    signOut: jest.fn(),
    currentUser: { uid: 'user123' },
  }),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: () => ({
    collection: () => ({
      doc: () => ({
        set: jest.fn(),
      }),
    }),
  }),
}));

// Define a test component that uses the AuthContext
const TestComponent = () => {
  const { userIn, login, register, logout } = React.useContext(AuthContext);

  return (
    <div>
      <span data-testid="user-status">{userIn ? 'User is logged in' : 'User is not logged in'}</span>
      <button data-testid="login-button" onClick={() => login('test@example.com', 'password')}>Login</button>
      <button data-testid="register-button" onClick={() => register('test@example.com', 'password')}>Register</button>
      <button data-testid="logout-button" onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  it('should render with the default userIn value', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const userStatus = getByTestId('user-status');
    expect(userStatus).toHaveTextContent('User is not logged in');
  });

  it('should log in a user when the login function is called', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    const userStatus = getByTestId('user-status');
    expect(userStatus).toHaveTextContent('User is logged in');
  });

  it('should register a user when the register function is called', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = getByTestId('register-button');
    fireEvent.press(registerButton);

    const userStatus = getByTestId('user-status');
    expect(userStatus).toHaveTextContent('User is logged in');
  });

  it('should log out a user when the logout function is called', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    const userStatusBeforeLogout = getByTestId('user-status');
    expect(userStatusBeforeLogout).toHaveTextContent('User is logged in');

    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);

    const userStatusAfterLogout = getByTestId('user-status');
    expect(userStatusAfterLogout).toHaveTextContent('User is not logged in');
  });
});
