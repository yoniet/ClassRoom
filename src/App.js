import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import MainRouter from './MainRouter';
import theme from './theme'
import { ThemeProvider } from '@mui/material'
import { Container } from '@mui/system';


const App = () => {
    return (

        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MainRouter />
            </BrowserRouter>
        </ThemeProvider>

    )
}



export default App;