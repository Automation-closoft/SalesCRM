import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB4nDvaS7IB7bYow4AeW7E3IUA7R5sSK54",
  authDomain: "sales-crm-7a3bf.firebaseapp.com",
  projectId: "sales-crm-7a3bf",
  storageBucket: "sales-crm-7a3bf.firebasestorage.app",
  messagingSenderId: "626139256671",
  appId: "1:626139256671:web:917eaba498738fcf9708ea",
  measurementId: "G-CK3YSTNKRV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const signup = async (username, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
};

const microsoftLogin = async () => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
};

export { signup, login, logout, googleLogin, microsoftLogin};
