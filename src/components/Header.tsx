import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material"
import { auth, logout } from "../authConfig"
import { useAuthState } from "react-firebase-hooks/auth"
import './Header.css'

export const Header = () => {
    //const [user, loading, error] = useAuthState(auth);
    const [user] = useAuthState(auth);

    return (
        <AppBar position="fixed" sx={{
            color: "black",
            backgroundColor: 'white',
            borderBottom: "1px solid #D8E7FF",
            boxShadow: "0px 0px 0px 0px"
        }}>
            <Toolbar variant="dense" >
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" spacing={2} sx={{marginRight: "10%"}}>
                    <p>{user?.email}</p>
                    <Button onClick={logout} sx={{ color: 'grey', backgroundColor: 'white', textTransform: "none" }}>Log out</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}