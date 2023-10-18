import { View, Text, StatusBar, Image, ScrollView} from 'react-native'
import React from 'react'


const Home = () => {
  return (
    <ScrollView style={{ backgroundColor: "#D5E3F0", flex: 1 }}>
      <StatusBar backgroundColor="#191970" />
      <View style={{ backgroundColor: "#191970", height: 130, justifyContent: "flex-end" }}>
        <View style={{ margin: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>Hello,</Text>
            <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>Flamboyant</Text>
          </View>
          <View>
            <Image source={require("../../../../assets/images/Awilo.jpeg")} style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 1, borderColor: "white" }} />
          </View>
        </View>
      </View>
      {/* body */}
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#1b1b1b", fontSize: 20, fontWeight: "800" }}>Your Balance</Text>
          <Text style={{ color: "black", fontSize: 28, fontWeight: "bold" }}>₹ 450,000</Text>
        </View>
        {/* totals */}
        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ justifyContent: "space-between", alignItems: "center", borderRadius: 10, backgroundColor: "white", elevation: 3, height: 170, width: 160, padding: 10 }}>
            <View style={{borderBottomColor: "#FFBF00", borderBottomWidth: 1}}><Text style={{ color:"black" }}>Debt Amount</Text></View>
            <Text style={{ color: "blue", fontWeight: "bold", fontSize: 25 }}>₹ 950,000</Text>
            <Text style={{ color: "green", fontSize: 11 }}>+8% more than last month</Text>
          </View>
          <View style={{ justifyContent: "space-between", alignItems: "center", borderRadius: 10, backgroundColor: "white", elevation: 3, height: 170, width: 160, padding: 10 }}>
            <View style={{borderBottomColor: "#FFBF00", borderBottomWidth: 1}}><Text style={{ color:"black" }}>Amount Recovered</Text></View>
            <Text style={{ color: "blue", fontWeight: "bold", fontSize: 25 }}>₹ 500,000</Text>
            <Text style={{ color: "red", fontSize: 11 }}>52.63% recovered</Text>
          </View>
        </View>
        {/* transactions overview*/}
        <View style={{ marginVertical: 20, backgroundColor: "white", borderRadius: 8 }}>
        <View style={{ padding: 10, borderBottomColor: "#FFBF00", borderBottomWidth: 1, alignItems: "center" }}>
          <Text style={{ color: "#000080", fontWeight: "bold", fontSize: 15, padding: 10 }}>Transactions Made</Text>
        </View>
        {transactions.map((transaction) => (
          <ListItem
            key={transaction.id}
            title={transaction.type}
            subtitle={`Amount: ₹ ${transaction.amount}`}
            // Add other transaction details as needed
            bottomDivider
          />
        ))}
        {loading && <ActivityIndicator size="large" color="#000080" />}
        <TouchableOpacity
          style={{ alignItems: 'center', padding: 10 }}
          onPress={() => navigation.navigate('AllTransactionsScreen')}>
          <Text style={{ color: 'blue', fontWeight: 'bold' }}>See All</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  )
}

export default Home