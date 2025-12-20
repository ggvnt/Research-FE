import Home from "@/components/Home";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import Splash from "../components/Splash";
import { restoreAuthFromStorage } from "../store/slices/authSlice";
import { store, useAppDispatch } from "../store/store";
import "./global.css";

const Stack = createStackNavigator();

const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreAuthFromStorage());
  }, [dispatch]);

  return null;
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthInitializer />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
