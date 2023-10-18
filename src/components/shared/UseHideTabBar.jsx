import {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const useHideTabBar = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
  }, [navigation]);
};

export default useHideTabBar;
// In this code snippet, the useNavigation hook is used to get the parent navigator
// and set its tabBarStyle option to { display: "none" } when the  component is displayed.
// When the component is unmounted, the tabBarStyle option is set back to undefined to restore the original
// tabBar style.
