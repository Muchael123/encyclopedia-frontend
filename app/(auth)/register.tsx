import Icon from "@/components/auth/Icons";
import Colors from "@/constants/Colors";
import { BACKEND_URL } from "@/constants/urls";
import { Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard
} from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useUserStore } from "@/store/emailstore";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);
  const [username, setUserName] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [securepass, setsecurepass] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validatePassword = (password: string) => {
    return password.trim().length >= 6;
  };
  const validateConfirm = (confirm: string) => {
    return confirm === password;
  };

  const handleRegister = async () => {
    if (
      !validateEmail(email) ||
      !validatePassword(password) ||
      !validateConfirm(confirm)
      || username.length < 3
      || password.length < 6
      || !validateConfirm(confirm)
      || !validateEmail(email)
    ) {
      Alert.alert("Error", "Validate your credentials and try again");
      return;
    }
    if (!agree) {
      Alert.alert(
        "Agreement",
        "To register, agree to our terma and conditions"
      );
      return;
    }
    console.log("Register button pressed");
    Keyboard.dismiss();
    try {
      setLoading(true);
      console.log("Registering user...", email, password, username);
      const res = await fetch(`${BACKEND_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        Alert.alert(
          "Error",
          data.error
            ? data.error
            : "An error occurred while registering."
        );
        return;
      }
      setEmail("");
      setUserName("");
      setPassword("");
      setConfirm("");
      Alert.alert("Success", "Registration successful!");
      //set useremail in zustand store
      useUserStore.setState({ email });
      return router.push("/(auth)/validate-email");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while registering.");

    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };
  const handleConfirmPasswordChange = (text: string) => {
    setConfirm(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstdiv}>
        <Text style={{ color: Colors.white, fontSize: 30, fontWeight: "400" }}>
          Wecome to Teacher Bomba
        </Text>
        {
          username.length < 3 && (
            <Text style={styles.green}>
              ✔ Username must be at least 3 characters
            </Text>
          )
        }
        {password.length < 6 && (
            <Text style={styles.green}>
              ✔ Password must be at least 6 characters
            </Text>
          )}
          {confirm !== password && (
            <Text style={styles.green}>
              ✔ Password and confirmation should match
            </Text>
          )}
          {!validateEmail(email) && ( 
            <Text style={styles.green}>
              ✔ Email should be valid
            </Text>
          )}
          
      </View>
      <ScrollView style={styles.seconddiv}>
        <Text style={styles.heading}>We are Glad you decided to Join us</Text>
        <Text style={styles.subheading}>Register to continue</Text>
        <View style={{ width: "100%", marginVertical: 8 }}>
          <Text>Username</Text>
          <TextInput
            placeholder="Your Username"
            value={username}
            onChangeText={setUserName}
            style={styles.input}
            maxLength={20}
          />
        </View>
        <View style={{ width: "100%", marginBottom: 8 }}>
          <Text>Email address</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            maxLength={60}
          />
        </View>

        <View style={{ width: "100%", marginBottom: 8 }}>
          <Text>Password</Text>
          <View style={styles.inputView}>
            <Fontisto name="locked" size={24} color={Colors.gray} />
            <TextInput
              placeholder="Enter your Password"
              placeholderTextColor={Colors.gray}
              secureTextEntry={secureTextEntry}
              style={{ color: Colors.purple, flex: 1 }}
              value={password}
              onChangeText={handlePasswordChange}
              returnKeyType="next"
              cursorColor={Colors.purple}
            />

            <Icon
              name={secureTextEntry ? "eye" : "eye-off"}
              color={Colors.gray}
              onPress={() => setSecureTextEntry((prev) => !prev)}
            />
          </View>
          
        </View>
        <View style={{ width: "100%", marginBottom: 8 }}>
          <Text>Confirm Password</Text>
          <View style={styles.inputView}>
            <Fontisto name="locked" size={24} color={Colors.gray} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={Colors.gray}
              secureTextEntry={securepass}
              style={{ color: Colors.purple, flex: 1 }}
              value={confirm}
              onChangeText={handleConfirmPasswordChange}
              returnKeyType="next"
              cursorColor={Colors.purple}
            />

            <Icon
              name={securepass ? "eye" : "eye-off"}
              color={Colors.gray}
              onPress={() => setsecurepass((prev) => !prev)}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setAgree((prev) => !prev)}
            style={styles.checkbox}
          >
            {agree && (
              <FontAwesome6 name="check" size={18} color={Colors.purple} />
            )}
          </TouchableOpacity>
          <Text>
            I agree with the <Text style={styles.link}>Terms & conditions</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
          {loading && (
            <FontAwesome6
              name="spinner"
              size={18}
              color={Colors.white}
              style={{ marginRight: 10 }}
            />
          )}
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Register"}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate("/(auth)/login")}>
          <Text style={styles.footerText}>
            Already have an account? Log In Here
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/(auth)/validate-email")}>
          <Text style={styles.footerText}>
            Already have a code? Verify Here
          </Text> 
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 24, fontWeight: "bold" },
  subheading: { fontSize: 14, color: "#888", marginBottom: 16 },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  green: { color: "", fontSize: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  link: { textDecorationLine: "underline" },
  button: {
    backgroundColor: "#2d0b4e",
    padding: 14,
    borderRadius: 20,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  firstdiv: {
    padding: 24,
    backgroundColor: Colors.purple,
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  seconddiv: {
    padding: 24,
    backgroundColor: Colors.white,
    height: "80%",
    width: "100%",
  },
  footerText: { textAlign: "center", marginTop: 20, color: "#2d0b4e" },
  inputView: {
    backgroundColor: "#f0f0f0",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: 6,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
});
