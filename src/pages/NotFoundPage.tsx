import { Button } from "@mui/material"
import "./NotFoundPage.css"

export const NotFoundPage = () => {
    return (
        <div className="page404">
            <div className="content404">
                <p className="header404">404</p>
                <p className="text404">Page not found</p>
                <Button sx={{color: "black", backgroundColor: "#D8E7FF", borderRadius: "24px", fontWeight: "700", fontSize: "12px", lineHeight: "16px"}}>Back to Search</Button>
            </div>
        </div>
    )
}