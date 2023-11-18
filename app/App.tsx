import React from "react";
import Login from "./screens/Login";
import Table from "./screens/Table";
import Chat from "./screens/Tables";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            title: "Tables",
            headerShown: false,
          }}
        />
        <Stack.Screen name="Table" component={Table} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
