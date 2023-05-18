import { Fragment } from "react"
import backgroundImage from "../assets/mainBackground.png"
import "./InitialPage.css"
import { Button, Grid } from "@mui/material"

export const InitialPage = () => {
    return (
        <Fragment >
            <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <Grid container spacing={0}>
                    <Grid xs={6}></Grid>
                    <Grid xs={6}>
                        <div className="initialPageForm">
                            <h1 className="titleHeader">Q-1 Search</h1>
                            <p className="initPageText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt u</p>
                            <Button variant="contained" sx={{ color: 'blue', backgroundColor: 'white', borderRadius: '16px' }}>Login</Button>
                        </div>
                    </Grid>
                    <Grid xs={6}></Grid>
                    <Grid xs={6}></Grid>
                </Grid>
            </div>
        </Fragment>
    )
} 