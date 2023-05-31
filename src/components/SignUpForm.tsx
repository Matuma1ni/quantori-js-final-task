import { Button, FilledInput, FormControl, FormHelperText, InputLabel } from "@mui/material"
import "./formStyle.css"
import { FC, useEffect, useRef, useState } from "react"
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "../authConfig";
import { PasswordInput } from "./PasswordInput";
import { firebaseErrorMessages } from "../helpers/errorMessages";
import { emailRegexp, passwordRegexp } from "../helpers/regexps";

interface Props {
    onClickLogin: () => void;
}

export const SignUpForm: FC<Props> = ({ onClickLogin }) => {
    // const [createUserWithEmailAndPassword, user, loading, error]
    const [
        createUserWithEmailAndPassword,
        _,
        __,
        signupError,
    ] = useCreateUserWithEmailAndPassword(auth);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const repeatPasswordRef = useRef<HTMLInputElement>(null);
    const [disablingButton, setDisablingButton] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repPasswordError, setRepPasswordError] = useState('');

    useEffect(() => {
        if (signupError?.code) {
            const error = firebaseErrorMessages[signupError.code] ?? firebaseErrorMessages['default'];
            if (error.field === 'email') {
                setEmailError(error.message)
            } else if (error.field === 'password') {
                setPasswordError(error.message)
            }
        }
    }, [signupError])

    const handleClickLogin = () => {
        onClickLogin();
    };

    const handleEmailFocus = () => {
        setEmailError('')
    }

    const handlePasswordFocus = () => {
        setPasswordError('')
    }

    const handleRepPasswordFocus = () => {
        setRepPasswordError('')
    }

    function handleInput() {
        setDisablingButton(!emailRef.current?.value || !passwordRef.current?.value || !repeatPasswordRef.current?.value);
    }


    const handleSignup = () => {
        if (emailRef.current && passwordRef.current && repeatPasswordRef.current) {
            const emailValid = emailRegexp.test(emailRef.current.value);
            const passwordValid = passwordRegexp.test(passwordRef.current.value);
            if (passwordRef.current.value.length < 6) {
                setPasswordError('Please, provide a password')
                return
            }
            if (!emailValid) {
                setEmailError('Please, provide valid email')
                return
            }
            if (passwordRef.current.value !== repeatPasswordRef.current.value) {
                setRepPasswordError("Passwords don't match")
                return
            }
            if (!passwordValid) {
                setPasswordError('Password should contain at least 1 lower case letter, 1 upper case letter and 1 number with minimal total length 6 characters')
                return
            }
            createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        }
    }

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Sign Up</h3>
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
                <PasswordInput onInputEnableButton={handleInput} onFocusResetError={handlePasswordFocus} inputRef={passwordRef} error={passwordError} />
                <h4 className="formHeader">Repeat Password</h4>
                <PasswordInput onInputEnableButton={handleInput} onFocusResetError={handleRepPasswordFocus} inputRef={repeatPasswordRef} error={repPasswordError} />
            </div>
            <Button
                onClick={handleSignup}
                disabled={disablingButton}
                sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700", textTransform: "none" }}
            >Create Account</Button>
            <p className="loginFooter">Already have an account?
                <span onClick={handleClickLogin} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
            </p>
        </div>
    )
}