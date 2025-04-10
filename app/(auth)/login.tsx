import Colors from '@/constants/Colors';
import { BACKEND_URL } from '@/constants/urls';
import { useAuthStore } from '@/store/authStore';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login button pressed");
   
    if (!email || !password) {
        Alert.alert("Error","Please fill in all fields.");
        return;
        }
    try{
      setLoading(true);
        const res = await fetch(`${BACKEND_URL}auth/login`, {
            method: "POST",
            headers:  {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const data = await res.json();
        console.log(data);
        if(!res.ok){
            setLoading(false);
            console.log("Invalid credentials", data);
            return;
        }
        const { token, user } = data;
        if(res.ok){
            console.log("Login successful", data);
            await useAuthStore.getState().login({ token, user });
        }

    } catch(err){
        console.error(err);
    } finally{
        setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
     <View style={styles.firstdiv}>
        <Text style={{color: Colors.white, fontSize: 40, fontWeight: "400"}}>Teacher Bomba</Text>
        </View>
        <View style={styles.seconddiv}>
     <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subheading}>Log in to continue</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={{width: "100%", marginVertical: 8}}>
        <Text>Email address</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      {!email.includes('@') && email !== '' && (
        <Text style={styles.error}>Your email is invalid.</Text>
      )}
      </View>
      <View style={{width: "100%", marginBottom: 8}}>
      <Text>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
</View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      onPress={handleLogin}
      disabled={loading}
      style={loading ? [styles.button, {backgroundColor: "#D8BFD8"}]: 
      styles.button}>
        <Text style={styles.buttonText}>{loading ? "Loading": "Log in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> router.navigate("/(auth)/register")}>
        <Text style={styles.footerText}>Don’t have an account? Register Now</Text>
      </TouchableOpacity>
     </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold' },
  subheading: { fontSize: 14, color: '#888', marginBottom: 16 },
  input: { backgroundColor: '#f0f0f0', padding: 12, marginVertical: 6, borderRadius: 8 },
  button: { backgroundColor: '#2d0b4e', padding: 14, borderRadius: 20, marginVertical: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  forgot: { textAlign: 'right', color: '#2d0b4e', marginVertical: 4 },
  error: { color: 'red', fontSize: 12, width: '100%', textAlign: 'center', marginVertical: 4, backgroundColor: '#f8d7da', padding: 10, borderRadius: 8 },
  footerText: { textAlign: 'center', marginTop: 20, color: '#2d0b4e' },
  firstdiv: {
    padding: 24,
    backgroundColor: Colors.purple,
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  seconddiv: {
    padding: 24,
    backgroundColor: Colors.white,
    height: "70%",
    width: "100%",
  },
  btnloading:{

  },
  
});
