import { Button, FilledInput, FormControl, InputLabel } from "@mui/material"
import "./formStyle.css"
import { FC, useRef } from "react"
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "../authConfig";
import { PasswordInput } from "./PasswordInput";

interface Props {
    onClickLogin: () => void;
}

export const SignUpForm: FC<Props> = ({ onClickLogin }) => {
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

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
                <FormControl sx={{ width: '100%', marginBottom: "20px", fontFamily: "Open Sans" }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-email">Enter your email</InputLabel>
                    <FilledInput
                        inputRef={emailRef}
                        id="filled-adornment-email"
                        type={'text'}
                    />
                </FormControl>
                <h4 className="formHeader">Password</h4>
                <PasswordInput inputRef={passwordRef} />
                <h4 className="formHeader">Repeat Password</h4>
                <PasswordInput inputRef={repeatPasswordRef} />
            </div>
            <Button onClick={handleSignup} sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700" }}>Create Account</Button>
            <p className="loginFooter">Already have an account?
                <span onClick={handleClickLogin} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
            </p>
        </div>
    )
}