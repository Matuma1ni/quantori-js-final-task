/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
import { useAuthState } from "react-firebase-hooks/auth"
import { Navigate } from "react-router-dom"
import { auth } from "../authConfig"
import { FC } from "react";

interface Props {
    children: React.ReactNode;
}

export const AuthRoute: FC<Props> = ({ children }) => {
    //const [user, loading, error] = useAuthState(auth);
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <></>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return (<>{children}</>);
};