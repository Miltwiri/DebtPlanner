import { createStackNavigator } from '@react-navigation/stack';
import Beneficiaries from '../../screens/Beneficiaries/Beneficiaries';
import BeneficiaryDetails from '../../screens/Beneficiaries/BeneficiaryDetails';
import AddBeneficiary from '../../screens/Beneficiaries/AddBeneficiary';
import AddCredit from '../../screens/Beneficiaries/AddCredit';
import AddDebt from '../../screens/Beneficiaries/AddDebt';




const BeneficiariesStack = createStackNavigator();

const BeneficiariesStackScreens = () => {
    return (
        <BeneficiariesStack.Navigator
            initialRouteName="BeneficiariesList"
            screenOptions={{
                headerShown: false,
            }}>
            <BeneficiariesStack.Screen name="BeneficiariesList" component={Beneficiaries} options={{}} />
            <BeneficiariesStack.Screen name="BeneficiaryDetails" component={BeneficiaryDetails} options={{}} />
            <BeneficiariesStack.Screen name="AddBeneficiary" component={AddBeneficiary} options={{}} />
            <BeneficiariesStack.Screen name="AddCredit" component={AddCredit} options={{}} />
            <BeneficiariesStack.Screen name="AddDebt" component={AddDebt} options={{}} />
        </BeneficiariesStack.Navigator>
    );
};
export default BeneficiariesStackScreens
