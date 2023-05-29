import { Button } from "@mui/material";
import { FC } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Props {
    title: string,
    link: string | null,
}

export const RefButton: FC<Props> = ({ title, link }) => {
    return (<Button
        variant="outlined"
        href={link ?? ""}
        target="_blank"
        disabled={!link}
        sx={{
            padding: "4px 5px 4px 12px",
            marginRight: "9px",
            textTransform: "none"
        }}>
        <div>
            {title}
            <OpenInNewIcon sx={{ width: "14px", height: "14px" }} />
        </div>
    </Button>)
}