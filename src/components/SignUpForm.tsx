import { Button } from "@mui/material"
import "./formStyle.css"
import { FC, useRef } from "react"
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "../authConfig";

interface Props {
    onClickLogin: () => void;
}

export const SignUpForm: FC<Props> = ({ onClickLogin }) => {
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const repeatPasswordRef = useRef<HTMLInputElement>(null);

    const handleClickLogin = () => {
        onClickLogin();
    };

    const handleSignup = () => {
        if (emailRef.current && passwordRef.current && repeatPasswordRef.current) {
            createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        }
    }

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Sign Up</h3>
            <div className="loginPasswordForm">
                <h4 className="formHeader">Email</h4>
                <input ref={emailRef} className="formInput" placeholder="Enter your email"></input>
                <h4 className="formHeader">Password</h4>
                <input ref={passwordRef} className="formInput" placeholder="Enter your password"></input>
                <h4 className="formHeader">Repeat Password</h4>
                <input ref={repeatPasswordRef} className="formInput" placeholder="Enter your password again"></input>
            </div>
            <Button onClick={handleSignup} sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700" }}>Create Account</Button>
            <p className="loginFooter">Already have an account?
                <span onClick={handleClickLogin} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
            </p>
        </div>
    )
}