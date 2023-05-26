import { SignUpForm } from "../components/SignUpForm"
import { LoginForm } from "../components/LoginForm"
import "./AuthPage.css"
import { useState } from "react"

export const AuthPage = () => {
    const [form, setForm] = useState('login')

    const handleLogin = () => {
        setForm("login")
    }
    const handleSignup = () => {
        setForm("signup")
    }

    if (form === "login") {
        return (
            <div className="loginLayout">
                <LoginForm onClickSignup={handleSignup} />
            </div>
        );
    }

    if (form === "signup") {
        return (
            <div className="loginLayout">
                <SignUpForm onClickLogin={handleLogin} />
            </div>
        );
    }

    return (
        <div className="loginLayout"></div>
    )
}