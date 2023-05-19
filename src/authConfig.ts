import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);

export const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    signOut(auth);
};