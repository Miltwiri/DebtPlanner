import { View, Text} from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';

const FilterModal = ({onBackDropPress, isVisible}) => {
  return (
    <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          backdropOpacity={0.7}
          onBackdropPress={onBackDropPress}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
            <View
              style={{
                height: 300,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 6,
              }}>
                <Text onPress={onBackDropPress}>Close</Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
              </View>
            </View>
          </View>
        </Modal>
  )
}

export default FilterModal