import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

export default function App() {
  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [requireRefresh, setRequireRefresh] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "605947170944-sfgm94bh04uhppq00610iume13t594f3.apps.googleusercontent.com",
  //  expoClientId: "605947170944-13ofgf1kitnofs0fh9fdkpvnki14rdpd.apps.googleusercontent.com"
  });

  useEffect(() => {
    //console.log(response?.authentication);
    if (response?.type === "success") {
      setAuth(response.authentication);
      const persistAuth = async () => {
        await AsyncStorage.setItem("auth", JSON.stringify(response.authentication));
      };
      persistAuth();
    }
  }, [response]);

  useEffect(() => {
    const getPersistedAuth = async () => {
      const authJson = await AsyncStorage.getItem("auth");
      if (authJson != null) {
        const authFromJson = JSON.parse(authJson);
        setAuth(authFromJson);
      //  console.log(authFromJson);
        setRequireRefresh(!AuthSession.TokenResponse.isTokenFresh({
          expiresIn: authFromJson.expiresIn,
          issuedAt: authFromJson.issuedAt
        }));
      }
    };
    getPersistedAuth();
  }, []);

  const getUserData = async () => {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });

    userInfoResponse.json().then(data => {
      //console.log(data);
      setUserInfo(data);
    });
  };

  const showUserData = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  };

  const getClientId = () => {
    if (Platform.OS === "ios") {
      return "605947170944-gu0r5oa054emprpmu7n27vmhvbue6c41.apps.googleusercontent.com";
    } else if (Platform.OS === "android") {
      return "605947170944-sfgm94bh04uhppq00610iume13t594f3.apps.googleusercontent.com";
    } else {
      console.log("Invalid platform - not handled");
    }
  }
  const logout = async () => {
    //console.log("here");
    await AuthSession.revokeAsync({
      token: auth.accessToken
    }, {
      revocationEndpoint: "https://oauth2.googleapis.com/revoke"
    });
    setAuth(undefined);
    setUserInfo(undefined);
    await AsyncStorage.removeItem("auth");
  };


 
  const refreshToken = async () => {
    const clientId = getClientId();
   // console.log(auth);
    const tokenResult = await AuthSession.refreshAsync({
      clientId: clientId,
      refreshToken: auth.refreshToken
    }, {
      tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
    });

    tokenResult.refreshToken = auth.refreshToken;

    setAuth(tokenResult);
    await AsyncStorage.setItem("auth", JSON.stringify(tokenResult));
    setRequireRefresh(false);
  };

  if (requireRefresh) {
    return (
      <View style={styles.container}>
        <Text>Token requires refresh...</Text>
        <Button title="Refresh Token" onPress={refreshToken} />
      </View>
    )
  }


  return (
    <View style={styles.container}>
      {showUserData()}
      <Button 
        title={auth ? "Get User Data": "Login"} 
        onPress={auth ? getUserData : () => promptAsync({ useProxy: false, showInRecents: true })}
      />
      {auth ? <Button title="Logout" onPress={logout} /> : undefined}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
