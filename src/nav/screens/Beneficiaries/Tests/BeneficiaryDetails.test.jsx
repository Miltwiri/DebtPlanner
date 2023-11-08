import React from 'react';
import { render, fireEvent,act } from '@testing-library/react-native';
import BeneficiaryDetails from '../BeneficiaryDetails';

// Mock the necessary dependencies
jest.mock('@react-native-firebase/firestore', () => ({
  collection: () => ({
    where: () => ({
      get: jest.fn().mockResolvedValue({
        forEach: jest.fn(),
      }),
    }),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/FontAwesome6', () => 'FontAwesome6');
jest.mock('react-native-vector-icons/Entypo', () => 'Entypo');
jest.mock('react-native-vector-icons/Fontisto', () => 'Fontisto');
jest.mock('react-native-gesture-handler', () => ({
  TouchableOpacity: 'TouchableOpacity',
}));

describe('BeneficiaryDetails', () => {
  const route = {
    params: { item: { name: 'John Doe', id: '1' } },
  };

  it('renders the component', () => {
    const { getByText, getByTestId } = render(<BeneficiaryDetails route={route} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByTestId('balance')).toBeTruthy();
    expect(getByTestId('transaction-list')).toBeTruthy();
  });

  it('calls the fetchUserTransactions function', async () => {
    const { getByText } = render(<BeneficiaryDetails route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Clear Transactions'));
    });

    // Add your assertions for the fetchUserTransactions function. 
  });

  it('calls the deleteClient function', async () => {
    const { getByText } = render(<BeneficiaryDetails route={route} />);
    
    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });
    
    // Add your assertions for the deleteClient function.
  });

  it('calls the sendWhatsAppMessageWithTransactions function', async () => {
    const { getByText } = render(<BeneficiaryDetails route={route} />);
    
    await act(async () => {
      fireEvent.press(getByText('Share on WhatsApp'));
    });
    
    // Add your assertions for the sendWhatsAppMessageWithTransactions function.
  });

  it('calls the clearTransactions function', async () => {
    const { getByText } = render(<BeneficiaryDetails route={route} />);
    
    await act(async () => {
      fireEvent.press(getByText('Clear Transactions'));
    });
    
    // Add your assertions for the clearTransactions function.
  });

  it('calls the toggleModal and toggleModal2 functions', async () => {
    const { getByText } = render(<BeneficiaryDetails route={route} />);
    
    await act(async () => {
      fireEvent.press(getByText('SEND MONEY'));
      fireEvent.press(getByText('RECEIVE PAYMENT'));
    });
    
    // Add your assertions for the toggleModal and toggleModal2 functions.
  });
});
