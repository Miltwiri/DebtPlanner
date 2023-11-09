import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import AddBeneficiary from './AddBeneficiary'; // Adjust the import path as needed

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
    jest.spyOn(firestore(), 'document').mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockResolvedValue(null);
    
    fireEvent.press(submitButton);
    
    // Wait for the Alert to appear
    await waitFor(() => expect(getByText('Upload Successful')).toBeDefined());
    
    // You can make additional assertions here as needed
  });
});
