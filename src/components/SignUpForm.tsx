import { Button } from "@mui/material"
import "./formStyle.css"
import { FC } from "react";

interface Props {
    onClickLogin: () => void;
}

export const SignUpForm: FC<Props> = ({ onClickLogin }) => {

    const handleClickLogin = () => {
        onClickLogin();
    };

    return (
        <div className="formContainer">
            <h3 className="loginHeader">Sign Up</h3>
            <div className="loginPasswordForm">
                <h4 className="formHeader">Email</h4>
                <input className="formInput" placeholder="Enter your email"></input>
                <h4 className="formHeader">Password</h4>
                <input className="formInput" placeholder="Enter your password"></input>
                <h4 className="formHeader">Repeat Password</h4>
                <input className="formInput" placeholder="Enter your password again"></input>
            </div>
            <Button sx={{ width: "86.6%", background: "#D8E7FF", borderRadius: "12px", color: "#175BC0", fontWeight: "700" }}>Create Account</Button>
            <p className="loginFooter">Already have an account?
                <span onClick={handleClickLogin} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
            </p>
        </div>
    )
}