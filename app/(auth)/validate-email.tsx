import { BACKEND_URL } from '@/constants/urls';
import { useUserStore } from '@/store/emailstore';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';


const VerifyCodeScreen = () => {
  const [code, setCode] = useState('');
  const email = useUserStore((state) => state.email);

  const handleVerify = async () => {
    if (code.length < 6 || code.length > 6) {
      Alert.alert('Error', 'Code must be 6 digits.');
      return;
    }
    try{
        const res = await fetch(`${BACKEND_URL}auth/validate-code`, {
            
        })
    } catch(err){
        console.error(err);
        Alert.alert('Error', 'An error occurred while verifying your email.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Verify Your Email</Text>
      <Text style={{ color: 'gray' }}>Code sent to {email}</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#C8A2C8',
          borderRadius: 8,
          padding: 10,
          marginTop: 20,
          fontSize: 18,
        }}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        placeholder="Enter verification code"
      />

      <TouchableOpacity
        onPress={handleVerify}
        style={{
          backgroundColor: '#C8A2C8',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyCodeScreen;
