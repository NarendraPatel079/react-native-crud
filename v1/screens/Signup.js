import React, { useState, useContext } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

// icons
import { Octicons, Ionicons } from '@expo/vector-icons'

// Date-Time Picker
import DateTimePicker from '@react-native-community/datetimepicker'

import { 
    StyledContainer, InnerContainer, PageTitle, SubTitle, StyledFormArea,
    LeftIcon, StyledInputLabel, StyledTextInput, RightIcon, StyledButton, ButtonText,
    Colors, MsgBox, Line, ExtraView, ExtraText, TextLink, TextLinkContent
} from './../components/styles';
import KeyboardAvoidingWarpper from '../components/KeyboardAvoidingWarpper';
import { addUserAPI } from '../services/UsersAPI.js';
import { RESPONSE_SUCCESS } from "@env";

// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials Context
import { CredentialsContext } from './../components/CredentialsContext';

const { brand, darkLight, primary } = Colors;

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [notifyMessage, setNotifyMessage] = useState();
    const [notifyType, setNotifyType] = useState();

    // Actual date of birth to be sent
    const [dob, setDob] = useState();

    // context
    const { storeCredentials, setStoreCredentials } = useContext(CredentialsContext);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow('date');
    }
    
    const handleSignup = async (credentials, setSubmitting) => {
        handleNotifyMessage(null);
        const response = await addUserAPI(credentials);
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
                    <PageTitle>Flower Crib</PageTitle>

                    <SubTitle>Account Signup</SubTitle>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            style={{
                                // backgroundColor: 'yellow',
                            }}
                        />
                    )}

                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            dateOfBirth: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values, dateOfBirth: (dob) ? dob : "" };
                            // console.log('form values', values);
                            // navigation.navigate("Welcome");
                            if (
                                values.name == '' || values.email == '' || values.password == '' ||
                                values.dateOfBirth == '' || values.password == '' || values.confirmPassword == ''
                            ) {
                                handleNotifyMessage(`Please fill all the fields`);
                                setSubmitting(false);
                            } else if (values.password !== values.confirmPassword) {
                                handleNotifyMessage(`Password and confirm password does not match.`);
                                setSubmitting(false);
                            } else {
                                handleSignup(values, setSubmitting);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Full Name"
                                    icon="person"
                                    placeholder="Nick Jonas"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values?.name}
                                />
                                
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
                                    label="Date of Birth"
                                    placeholder="YYYY - MM - DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('dateOfBirth')}
                                    onBlur={handleBlur('dateOfBirth')}
                                    value={dob ? dob.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker}
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
                                
                                <MyTextInput
                                    label="Confirm Password"
                                    icon="lock"
                                    placeholder="* * * * * * * * * *"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values?.confirmPassword}
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
                                            Signup
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

                                <ExtraView>
                                    <ExtraText>
                                        Already have an account?
                                    </ExtraText>
                                    <TextLink onPress={() => navigation.navigate("Login")}>
                                        <TextLinkContent> Login</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
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
            
            {
                isDate && (
                    <TouchableOpacity
                        onPress={showDatePicker}
                    >
                        <StyledTextInput {...props} />
                    </TouchableOpacity>
                )
            }
            {
                !isDate && <StyledTextInput {...props} />
            }

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

export default Signup;