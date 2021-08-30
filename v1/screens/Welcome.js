import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

import { 
    InnerContainer, PageTitle, SubTitle, StyledFormArea, StyledButton, ButtonText,
    Line, WelcomeContainer, WelcomeImage, Avatar
} from './../components/styles';

// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials Context
import { CredentialsContext } from './../components/CredentialsContext';

const Welcome = ({ navigation }) => {
    // console.log('route', route);
    // const { name, email, photoUrl } = route.params;
    // const AvatarImg = (photoUrl) ? { uri: photoUrl } : require('./../assets/img/img1.png');
    
    // context
    const { storeCredentials, setStoreCredentials } = useContext(CredentialsContext);

    const { name, email, photoUrl } = storeCredentials;
    const AvatarImg = (photoUrl) ? { uri: photoUrl } : require('./../assets/img/img1.png');

    const Logout = () => {
        AsyncStorage
        .removeItem('reactNativeCRUDCredentials')
        .then(() => {
            setStoreCredentials("");
        })
        .catch(error => console.error(error));
    }

    return (
        <>
            <StatusBar
                style="light"
            />
            <InnerContainer>
                <WelcomeImage
                    resizeMode="cover"
                    source={
                        require('./../assets/img/img2.png')
                    }
                />
                
                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome! Buddy</PageTitle>

                    <SubTitle welcome={true}>{name || "Nick's"}</SubTitle>
                    <SubTitle welcome={true}>{email || "nicks@gmail.com"}</SubTitle>

                    <StyledFormArea>
                        <Avatar
                            resizeMode="cover"
                            source={AvatarImg}
                        />
                        
                        <Line />

                        <StyledButton
                            onPress={Logout}
                        >
                            <ButtonText>
                                Logout
                            </ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    )
}

export default Welcome;