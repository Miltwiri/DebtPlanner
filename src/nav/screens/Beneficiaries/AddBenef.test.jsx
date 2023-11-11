import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddBeneficiary from './AddBeneficiary'; // Adjust the import path as needed
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Mock useNavigation from @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe('AddBeneficiary', () => {
  it('renders the component', () => {
    const { getByText, getByPlaceholder } = render(<AddBeneficiary />);

    // Ensure that key elements are present in the component
    expect(getByText('Add a New Beneficiary')).toBeDefined();
    expect(getByText('Name')).toBeDefined();
    expect(getByPlaceholder('Full Name')).toBeDefined();
    expect(getByText('Phone Number')).toBeDefined();
    expect(getByPlaceholder('Enter Phone')).toBeDefined();
    expect(getByText('Email')).toBeDefined();
    expect(getByPlaceholder('Email')).toBeDefined();
    expect(getByText('Level')).toBeDefined();
    expect(getByPlaceholder('Gold/Silver/Platinum')).toBeDefined();
    expect(getByText('Submit')).toBeDefined();
  });

  it('handles form submission', async () => {
    const { getByText, getByPlaceholder } = render(<AddBeneficiary />);

    // Fill in the form fields
    const nameInput = getByPlaceholder('Full Name');
    const phoneInput = getByPlaceholder('Enter Phone');
    const emailInput = getByPlaceholder('Email');
    const levelInput = getByPlaceholder('Gold/Silver/Platinum');
    const submitButton = getByText('Submit');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(phoneInput, '1234567890');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    fireEvent.changeText(levelInput, 'Gold');

    // Mock the Firestore functions (you may need to adapt this for your actual code)
    const mockAdd = jest.fn();
    const mockUpdate = jest.fn();
    jest.spyOn(firestore(), 'collection').mockReturnValue({
      add: mockAdd,
    });
    mockAdd.mockResolvedValue({
      id: 'mockDocumentId',
    });
    jest.spyOn(firestore(), 'doc').mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockResolvedValue(null);

    // Mock the Alert function
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing the "OK" button
      buttons[0].onPress();
    });

    fireEvent.press(submitButton);

    // Wait for the Alert to appear
    await waitFor(() => expect(getByText('Upload Successful')).toBeDefined());

    // You can make additional assertions here as needed
  });
});
