import { Fragment } from "react"
import "./InitialPage.css"
import { Button, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const InitialPage = () => {
    const navigate = useNavigate();
    
    const navigateToLogin = () => {
        navigate('/auth');
      };

    return (
        <Fragment >
            <Grid container spacing={0}>
                <Grid xs={6}></Grid>
                <Grid xs={6}>
                    <div className="initialPageForm">
                        <h1 className="titleHeader">Q-1 Search</h1>
                        <p className="initPageText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt u</p>
                        <Button variant="contained" onClick={navigateToLogin} sx={{ color: 'blue', backgroundColor: 'white', borderRadius: '16px' }}>Login</Button>
                    </div>
                </Grid>
                <Grid xs={6}></Grid>
                <Grid xs={6}></Grid>
            </Grid>
        </Fragment>
    )
} 