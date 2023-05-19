import { FC } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { Navigate } from "react-router-dom"
import { auth } from "../authConfig"

interface Props {
    children: React.ReactNode;
}

export const NotAuthRoute: FC<Props> = ({ children }) => {
    //const [user, loading, error] = useAuthState(auth);
    const [user] = useAuthState(auth);

    if (user) {
        return <Navigate to="/search" />;
    }

    return (<>{children}</>);
};