import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBXsR3lQludrXUZAtgnSB4JmBtyVfPLfU",
  authDomain: "my-finance---trail.firebaseapp.com",
  projectId: "my-finance---trail",
  storageBucket: "my-finance---trail.firebasestorage.app",
  messagingSenderId: "151740749193",
  appId: "1:151740749193:web:16f0740d30dffa8f29fd58",
  measurementId: "G-2PS4YQ8MKW"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
