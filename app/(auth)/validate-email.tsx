import Colors from '@/constants/Colors';
import { BACKEND_URL } from '@/constants/urls';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/emailstore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard } from 'react-native';

const VerifyCodeScreen = () => {
  const [code, setCode] = useState('');
  const email = useUserStore((state) => state.email);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(true);

  // Timer countdown logic
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const handleVerify = async () => {
    Keyboard.dismiss();
    if (code.length !== 6) {
      Alert.alert('Error', 'Code must be 6 digits.');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Email not found.');
      return;
    }
    if (!Number.isInteger(Number(code))) {
      Alert.alert('Error', 'Code must be a number.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}auth/validate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: Number(code) }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'An error occurred while verifying your email.');
        console.log('Invalid credentials', data);
        return;
      }

      const { token, user } = data;
      if (res.ok) {
        console.log('Login successful', data);
        await useAuthStore.getState().login({ token, user });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while verifying your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found.');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        Alert.alert('Error', data.error || 'An error occurred while resending the code.');
        return;
      }

      Alert.alert('Success', 'Code resent successfully.');
      setTimer(60);
      setTimerActive(true);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while resending the code.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstdiv}>
        <Text style={styles.title}>Teacher Bomba</Text>
        <Text style={styles.subtitle}>Enter code sent to {email}</Text>
      </View>

      <View style={styles.seconddiv}>
        <Text style={styles.heading}>Verify Your Email</Text>
        <Text style={styles.subheading}>Code sent to {email}</Text>

        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          placeholder="Enter verification code"
        />

        <View style={styles.resendRow}>
          <TouchableOpacity onPress={handleResend} disabled={timerActive}>
            <Text style={[styles.footerText, { color: Colors.purple }]}>
              {timerActive ? `Resend Code (${timer}s)` : 'Resend Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate('/(auth)/register')}>
            <Text style={styles.footerText}>Go back</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          style={[styles.button, loading && { backgroundColor: '#aaa' }]}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { color: Colors.white, fontSize: 40, fontWeight: '400' },
  subtitle: { color: Colors.white, fontSize: 14, fontWeight: '200', marginTop: 12 },
  heading: { fontSize: 22, marginBottom: 10 },
  subheading: { color: 'gray' },
  input: { backgroundColor: '#f0f0f0', padding: 12, marginVertical: 10, borderRadius: 8 },
  button: {
    backgroundColor: Colors.purple,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  footerText: { textAlign: 'center', marginTop: 20 },
  resendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  firstdiv: {
    padding: 24,
    backgroundColor: Colors.purple,
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seconddiv: {
    padding: 24,
    backgroundColor: Colors.white,
    height: '80%',
    width: '100%',
  },
});

export default VerifyCodeScreen;
