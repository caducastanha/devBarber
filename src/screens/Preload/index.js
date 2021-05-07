import React, { useContext, useEffect } from 'react';
import { Container, LoadingIcon } from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';

import BarberLogo from '../../assets/barber.svg';
import Api from '../../Api';

const Preload = () => {
  const { dispatch: userDispatch } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          let res = await Api.checkToken(token);
          if (res.token) {
            await AsyncStorage.setItem('token', res.token);
  
            userDispatch({
              type: 'setAvatar',
              payload: {
                avatar: res.data.avatar
              }
            });
  
            navigation.reset({
              routes: [{ name: 'MainTab' }]
            });
          }
        } catch (error) {
          console.log(error);
          alert('acesso expirou!');
          navigation.navigate('SignIn');
        }
      } else {
        navigation.navigate('SignIn');
      }
    }

    checkToken();
  }, [])

  return (
    <Container>
      <BarberLogo width="100%" height="160" />
      <LoadingIcon size="large" color="#ffffff" />
    </Container>
  );
}

export default Preload;