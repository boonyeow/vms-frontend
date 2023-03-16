import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function HomeButton() {
    const navigate = useNavigate();
  
    function handleClick() {
      navigate("/home");
    }

    return (
        <Button variant='outlined' sx={{mr:3}} onclick={handleClick}><a href='/home'>Back to home</a></Button>
    )
}
export default HomeButton;