import { Button, FilledInput, FormControl, InputLabel } from "@mui/material"
import "./formStyle.css"
import { FC, useRef } from "react"
import { login } from "../authConfig"
import { PasswordInput } from "./PasswordInput"

interface Props {
    onClickSignup: () => void;
}

export const LoginForm: FC<Props> = ({ onClickSignup }) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleClickSignup = () => {
        onClickSignup();
    }

    const handleLogin = () => {
        if (emailRef.current && passwordRef.current) {
            login(emailRef.current.value, passwordRef.current.value);
        }
    }

    //<input ref={emailRef} className="formInput" placeholder="Enter your email"></input>
    //<input type="password" ref={passwordRef} className="formInput" placeholder="Enter your password"></input>

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Login</h3>
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
            </div>
            <Button onClick={handleLogin} sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700" }}>Login</Button>
            <p className="loginFooter">Don’t have an account?
                <span onClick={handleClickSignup} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Sign up </span>
            </p>
        </div>
    )
}