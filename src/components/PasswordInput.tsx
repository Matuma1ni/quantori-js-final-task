import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from "@mui/material";
import { FC, useState } from "react";

interface Props {
    inputRef: React.RefObject<HTMLInputElement>
}

export const PasswordInput:FC<Props> = ({ inputRef }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };
    
    return (
        <FormControl sx={{ width: '100%', marginBottom: "20px", fontFamily: "Open Sans" }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">Enter your password</InputLabel>
            <FilledInput
                inputRef={inputRef}
                id="filled-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}