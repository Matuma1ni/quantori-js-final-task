import { Button } from "@mui/material";
import "./formStyle.css"
import { FC } from "react";

interface Props {
    onClickSignup: () => void;
}

export const LoginForm: FC<Props> = ({onClickSignup}) => {

    const handleClickSignup = () => {
        onClickSignup();
    }

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Login</h3>
            <div className="loginPasswordForm">
                <h4 className="formHeader">Email</h4>
                <input className="formInput" placeholder="Enter your email"></input>
                <h4 className="formHeader">Password</h4>
                <input className="formInput" placeholder="Enter your password"></input>
            </div>
            <Button sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700" }}>Login</Button>
            <p className="loginFooter">Don’t have an account? 
                <span onClick={handleClickSignup} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Sign up </span>
            </p>
        </div>
    )
}