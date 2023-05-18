import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material"

export const Header = () => {
    const user = {email: "test@gmail.com"}
    return (
        <AppBar position="fixed" sx={{color: "black", backgroundColor: 'white', borderBottom: "1px solid #D8E7FF", boxShadow: "0px 0px 0px 0px"}}>
            <Toolbar variant="dense" > 
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" spacing={2} >
                    <p>{user.email}</p>
                    <Button sx={{color: 'grey', backgroundColor: 'white'}}>Log out</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}