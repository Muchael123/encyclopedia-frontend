import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function LandingScreen() {
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Bomba</Text>
      <Image source={require('../../assets/images/illustration.png')} style={styles.image} />
      <Text style={styles.subtitle}>Smart learning, just for you!</Text>

      <Link style={styles.button} href={"/(auth)/login"}>
        <Text style={styles.buttonText}>Log in</Text>
      </Link>

      <Link style={styles.buttonOutline} href={"/(auth)/register"}>
        <Text style={styles.buttonText}>Register</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8e44ad',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#2d0b4e',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonOutline: {
    borderColor: '#fff',
    borderWidth: 1,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
