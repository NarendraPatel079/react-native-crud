import React from 'react';
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from './../components/styles';

const KeyboardAvoidingWarpper = ({ children }) => {
    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.primary}}>
            <ScrollView>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default KeyboardAvoidingWarpper;