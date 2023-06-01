import { Button, FilledInput, FormControl, FormHelperText, InputLabel } from "@mui/material"
import "./formStyle.css"
import { FC, useEffect, useRef, useState } from "react"
import { auth } from "../authConfig"
import { PasswordInput } from "./PasswordInput"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { firebaseErrorMessages } from "../helpers/errorMessages"
import { emailRegexp } from "../helpers/regexps"

interface Props {
    onClickSignup: () => void;
}

export const LoginForm: FC<Props> = ({ onClickSignup }) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // [signInWithEmailAndPassword, user, loading, loginError]
    const [
        signInWithEmailAndPassword,
        _,
        __,
        loginError,
    ] = useSignInWithEmailAndPassword(auth);

    const [disablingButton, setDisablingButton] = useState(true)

    useEffect(() => {
        if (loginError?.code) {
            const error = firebaseErrorMessages[loginError.code] ?? firebaseErrorMessages['default'];
            if (error.field === 'email') {
                setEmailError(error.message)
            } else if (error.field === 'password') {
                setPasswordError(error.message)
            }
        }
    }, [loginError])

    const handleClickSignup = () => {
        onClickSignup();
    }

    const handleLogin = () => {
        if (emailRef.current && passwordRef.current) {
            const emailValid = emailRegexp.test(emailRef.current.value);
            if (passwordRef.current.value.length < 6) {
                console.log('Please, provide a password')
                setPasswordError('Please, provide a password')
                return
            }
            if (!emailValid) {
                console.log('Please, provide valid email')
                setEmailError('Please, provide valid email')
                return
            }
            signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
        }
    }

    const handleEmailFocus = () => {
        setEmailError('')
    }

    const handlePasswordFocus = () => {
        setPasswordError('')
    }

    function handleInput() {
        setDisablingButton(!emailRef.current?.value || !passwordRef.current?.value);
    }


    //<input ref={emailRef} className="formInput" placeholder="Enter your email"></input>
    //<input type="password" ref={passwordRef} className="formInput" placeholder="Enter your password"></input>

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Login</h3>
            <div className="loginPasswordForm">
                <h4 className="formHeader">Email</h4>
                <FormControl onInput={handleInput} onFocus={handleEmailFocus} error={!!emailError} sx={{ width: '100%', marginBottom: "20px", fontFamily: "Open Sans" }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-email">Enter your email</InputLabel>
                    <FilledInput
                        inputRef={emailRef}
                        id="filled-adornment-email"
                        type={'text'}
                    />
                    {(emailError) && <FormHelperText>{emailError}</FormHelperText>}
                </FormControl>
                <h4 className="formHeader">Password</h4>
                <PasswordInput onInputEnableButton={handleInput} onFocusResetError={handlePasswordFocus} error={passwordError} inputRef={passwordRef} />
            </div>
            <Button
                onClick={handleLogin}
                disabled={disablingButton}
                sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700", textTransform: "none" }}
            >Login</Button>
            <p className="loginFooter">Don’t have an account?
                <span onClick={handleClickSignup} style={{ textDecoration: 'underline', cursor: 'pointer' }}> Sign up </span>
            </p>
        </div>
    )
}