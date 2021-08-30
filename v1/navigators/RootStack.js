import React from 'react';

// react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Credentials Context
import { CredentialsContext } from './../components/CredentialsContext';

// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';

import { Colors } from './../components/styles';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <CredentialsContext.Consumer>
            {
                ({ storeCredentials }) => (
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerTintColor: Colors.tertiary,
                                headerTransparent: true,
                                headerTitle: '',
                                headerStyle: {
                                    backgroundColor: 'transparent'
                                },
                                headerLeftContainerStyle: {
                                    paddingLeft: 10,
                                }
                            }}
                            initialRouteName="Login"
                        >
                            {
                                storeCredentials
                                ? <Stack.Screen name="Welcome" component={Welcome} options={{headerTintColor: Colors.primary}} />
                                : <>
                                    <Stack.Screen name="Login" component={Login} />
                                    <Stack.Screen name="Signup" component={Signup} />
                                </>
                            }
                        </Stack.Navigator>
                    </NavigationContainer>
                )
            }
        </CredentialsContext.Consumer>
    );
}

export default RootStack;