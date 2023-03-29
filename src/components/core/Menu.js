import React from 'react';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import HouseIcon from '@mui/icons-material/House'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { auth } from '../auth/auth-helper';
import { useNavigate } from 'react-router-dom';
import { LocalLibrary } from '@mui/icons-material';


const isActive = (history, path) => {
    if (history === path) {
        return { color: '#f57c00' }
    } else {
        return { color: '#fffde7' }
    }
}

const isParActive = (history, path) => {
    // FIX: this if is not work correct because the parameter "history" is not problem
    if (history === path) {
        return {color: '#fffde7', backgroundColor: '#f57c00', marginRight:10}
    } else {
       return {color: '#616161', backgroundColor: '#fffde7', border:'1px solid #f57c00', marginRight:10}
    }
}


const Menu = ({ history }) => {
    let navigate = useNavigate();

    return (

        <AppBar position="relative" style={{ zIndex: 12343455 }}>
            <Toolbar>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <IconButton sx={{ flexGrow: 2, justifyContent: 'flex-start' }} style={isActive(history, "/")} >
                        <HouseIcon />
                    </IconButton>
                </Link>
                <Typography sx={{ flexGrow: 2 }} variant="h6" color="inherit">
                    Classroom
                </Typography>
                <Box sx={{ justifyContent: 'flex-end' }}>
      
                    {
                        !auth.isAuthenticated() && (
                            <span>
                                <Link to="/signup" style={{ textDecoration: 'none' }}>
                                    <Button color="inherit" >Sign up</Button>
                                </Link>
                                <Link to="/signin" style={{ textDecoration: 'none' }}>
                                    <Button color="inherit">Sign in</Button>
                                </Link>
                            </span>
                        )
                    }
                    {
                        auth.isAuthenticated() && (
                            <span>
                                {auth.isAuthenticated().user.educator && (<Link to="/teach/courses"><Button style={isParActive(history, "/teach/")}>

                                    <LocalLibrary />Teach</Button></Link>
                                )
                                }
                                <Link to={"/user/" + auth.isAuthenticated().user._id} style={{ textDecoration: 'none' }}>
                                    <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
                                </Link>
                                <Button color="inherit" onClick={() => {
                                    auth.clearJWT(() => navigate('/'))
                                }}>
                                    Sign Out
                                </Button>
                            </span>
                        )
                    }

                </Box>
            </Toolbar>
        </AppBar>
    )

}

export default Menu;