
import './App.css'
import StageManager from "./StageManager.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

function App() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
  return (
    <>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline></CssBaseline>
            <StageManager>
            </StageManager>
        </ThemeProvider>
    </>
  )
}

export default App
