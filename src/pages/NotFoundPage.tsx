import { Button } from "@mui/material"
import "./NotFoundPage.css"
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    
    const navigateToInitial = () => {
        navigate('/');
      };
      
    return (
        <div className="page404">
            <div className="content404">
                <p className="header404">404</p>
                <p className="text404">Page not found</p>
                <Button onClick={navigateToInitial} sx={{color: "black", backgroundColor: "#D8E7FF", borderRadius: "24px", fontWeight: "700", fontSize: "12px", lineHeight: "16px"}}>Back to Search</Button>
            </div>
        </div>
    )
}