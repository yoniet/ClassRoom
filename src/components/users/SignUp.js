import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { create } from "./api-user";
import { Link } from 'react-router-dom'

const SignUp = () => {

    const [userDetail, setUserDetail] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: '',
    })

    const handleChange = name => event => {
        setUserDetail({ ...userDetail, [name]: event.target.value })
    }

    const clickSubmit = () => {
        const newUser = {
            name: userDetail.name,
            email: userDetail.email,
            password: userDetail.password
        }
        // call function create from api-user
        create(newUser)
            .then((data) => {
                // to check response from server
                if (data.error) {
                    setUserDetail({ ...userDetail, error: data.error })
                } else {
                    setUserDetail({ ...userDetail, error: '', open: true })
                }
            })
    }

    return (
        <Container>
            <Card>
                <CardContent>
                    <Typography>
                        Sign Up
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <TextField type="text" id="name" label="Name" value={userDetail.name} onChange={handleChange('name')} />
                        <TextField type="email" id="email" label="Email" value={userDetail.email} onChange={handleChange('email')} />
                        <TextField type="password" id="password" label="Password" value={userDetail.password} onChange={handleChange('password')} />
                    </Box>
                </CardContent>
                <CardActions >
                    <Button onClick={clickSubmit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={userDetail.open}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New Account successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin" style={{ textDecoration: 'none' }}>
                        <Button autoFocus="autoFocus" variant="contained">Sign In</Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default SignUp;