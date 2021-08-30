import React, { useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

// icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'

import { 
    StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea,
    LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText,
    Colors, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent
} from './../components/styles';
import KeyboardAvoidingWarpper from '../components/KeyboardAvoidingWarpper';
import { LoginAPI } from '../services/UsersAPI.js';
import { RESPONSE_SUCCESS } from "@env";

import * as Google from 'expo-google-app-auth';

// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials Context
import { CredentialsContext } from './../components/CredentialsContext';

const { brand, darkLight, primary } = Colors;

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [notifyMessage, setNotifyMessage] = useState();
    const [notifyType, setNotifyType] = useState();
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    // context
    const { storeCredentials, setStoreCredentials } = useContext(CredentialsContext);

    const handlerLogin = async (credentials, setSubmitting) => {
        handleNotifyMessage(null);
        const password = credentials?.password;
        const response = await LoginAPI(credentials);
        credentials.password = password; // reset the user input password
        // console.log('response', response);
        if (response.hasOwnProperty('data')) {
            const { message, status, data } = response.data;
            if (RESPONSE_SUCCESS == status) {
                // navigation.navigate("Welcome", { ...data });
                persistLogin({ ...data }, message, status);
            } else {
                handleNotifyMessage(message, status);
            }
        }
        
        setSubmitting(false);
    };

    const handleNotifyMessage = (message, type = 'FAILED') => {
        setNotifyMessage(message);
        setNotifyType(type);
    }

    const handleGoogleSignin = () => {
        setGoogleSubmitting(true);

        const config = {
            iosClientId: `924326123477-h30g8g30vet92h3ekun9jdl8bi05ssk2.apps.googleusercontent.com`,
            androidClientId: `924326123477-6p1f657enml10h8egh9nhk0r1aahrf9d.apps.googleusercontent.com`,
            scopes: ['profile', 'email']
        };

        Google
        .logInAsync(config)
        .then((result) => {
            // console.log('google result', result);
            const { type, user } = result;

            if (type === 'success') {
                const { email, name, photoUrl } = user;
                // handleNotifyMessage("Google sign-in successfully.", "SUCCESS");
                // setTimeout(() => navigation.navigate("Welcome", { email, name, photoUrl }), 1000);

                persistLogin({ email, name, photoUrl }, "Google sign-in successfully.", "SUCCESS");
            } else {
                handleNotifyMessage("Google sign-in was cancelled.");
            }
            setGoogleSubmitting(false);
        })
        .catch(error => {
            console.error(error);
            handleNotifyMessage(error?.message);
            setGoogleSubmitting(false);
        });
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage
        .setItem('reactNativeCRUDCredentials', JSON.stringify(credentials))
        .then((result) => {
            handleNotifyMessage(message, status);
            setStoreCredentials(credentials);
            // if (result && result !== null) {
            //   setStoreCredentials(JSON.parse(result));
            // } else {
            //   setStoreCredentials(null);
            // }
        })
        .catch(error => {
            console.error(error)
            handleNotifyMessage((error?.message) ? error?.message : "Persisting login failed.");
        });
    }

    return (
        <KeyboardAvoidingWarpper>
            <StyledContainer>
                <StatusBar
                    style="dark"
                />
                <InnerContainer>
                    <PageLogo
                        resizeMode="cover"
                        source={
                            require('./../assets/img/img1.png')
                        }
                    />
                    <PageTitle>Flower Crib</PageTitle>

                    <SubTitle>Account Login</SubTitle>

                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            // console.log('form values', values);
                            if (values.email == '' || values.password == '') {
                                handleNotifyMessage(`Please fill all the fields`);
                                setSubmitting(false);
                            } else {
                                handlerLogin(values, setSubmitting);
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="nicks@gmail.com"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values?.email}
                                    keywordType="email-address"
                                />
                                
                                <MyTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="* * * * * * * * * *"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values?.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />

                                <MsgBox type={notifyType}>
                                    {notifyMessage}
                                </MsgBox>
                                
                                {
                                    !isSubmitting && 
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>
                                            Login
                                        </ButtonText>
                                    </StyledButton>
                                }
                                {
                                    isSubmitting && 
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator
                                            size="large"
                                            color={primary}
                                        />
                                    </StyledButton>
                                }

                                <Line />

                                {
                                    !googleSubmitting &&
                                    <StyledButton 
                                        google={true} 
                                        onPress={handleGoogleSignin}
                                    >
                                        <Fontisto 
                                            name="google"
                                            color={primary}
                                            size={25}
                                        />
                                        
                                        <ButtonText google={true}>
                                            Sign in with Google
                                        </ButtonText>
                                    </StyledButton>
                                }
                                {
                                    googleSubmitting && (
                                        <StyledButton 
                                            google={true} 
                                            disabled={true}
                                        >
                                            <ActivityIndicator
                                                size="large"
                                                color={primary}
                                            />
                                        </StyledButton>
                                    )
                                }

                                <ExtraView>
                                    <ExtraText>
                                        Don't have an account already?
                                    </ExtraText>
                                    <TextLink onPress={() => navigation.navigate("Signup")}>
                                        <TextLinkContent> Signup</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWarpper>
    )
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons
                    name={icon}
                    size={30}
                    color={brand}
                />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon
                    onPress={() => setHidePassword(!hidePassword)}
                >
                    <Ionicons
                        size={30}
                        color={darkLight}
                        name={hidePassword ? 'md-eye-off' : 'md-eye'}
                    />
                </RightIcon>
            )}
        </View>
    );
}

export default Login;