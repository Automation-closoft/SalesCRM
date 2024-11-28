import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { toast } from "react-toastify";

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
    toast.success("Signup successful! Welcome, " + username);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logout successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    toast.success("Google login successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const microsoftLogin = async () => {
  try {
    const provider = new OAuthProvider('microsoft.com');
    await signInWithPopup(auth, provider);
    toast.success("Microsoft login successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const phoneLogin = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    toast.info("OTP sent successfully. Verify to complete login.");
    return confirmationResult;
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const setupReCAPTCHA = (containerId) => {
  try {
    return new RecaptchaVerifier(containerId, {
      size: "invisible",
      callback: (response) => {
        toast.success("ReCAPTCHA verified!");
      },
    }, auth);
  } catch (error) {
    console.error(error);
    toast.error("ReCAPTCHA setup failed.");
  }
};
const checkPhoneNumberExists = async (phoneNumber, appVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // If the code executes successfully, it means the phone number exists
      toast.info("Phone number exists. OTP sent.");
      return true;
    } catch (error) {
      if (error.code === 'auth/invalid-phone-number') {
        toast.error("Invalid phone number format.");
      } else if (error.code === 'auth/user-not-found') {
        toast.warning("Phone number does not exist.");
      } else {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
      }
      return false;
    }
  };
  

export { signup, login, logout, googleLogin, microsoftLogin, phoneLogin, setupReCAPTCHA,checkPhoneNumberExists };
