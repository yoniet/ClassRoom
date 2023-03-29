import { Edit, Person } from '@mui/icons-material';
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { read } from './api-user'
import { auth } from '../auth/auth-helper'
import { Navigate, Link, useParams } from 'react-router-dom'
import DeleteUser from './DeleteUser'
import theme from '../../theme';

const sxStyle = {
    root: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
    },
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle
    }
}

const Profile = () => {
    const { userId } = useParams()

    const [user, setUser] = useState({});
    const [redirectToSignIn, setRedirectToSignIn] = useState(false);


    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated()

        read({
            userId: userId
        }, { t: jwt.token }, signal)
            .then((data) => {
                if (data && data.error) {
                    setRedirectToSignIn(true)
                } else {
                    setUser(data)
                }
            })


        return function cleanup() {
            abortController.abort()
        }
    }, [userId])

    if (redirectToSignIn) {
        return <Navigate to='/signin' />
    }

    return (
            <Paper sx={sxStyle.root}>
                <Typography variant='h6' sx={sxStyle.title}>
                    Profile
                </Typography>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Person />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} secondary={user.email} />
                        {
                            auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id &&
                            (<ListItemSecondaryAction>
                                <Link to={"/user/edit/" + user._id} >
                                    <IconButton aria-label='Edit' >
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id} />
                            </ListItemSecondaryAction>
                            )
                        }
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={"Joined: " + (
                            new Date(user.created)).toDateString()} />
                    </ListItem>
                    <Divider />
                </List>
            </Paper>
    )
}

export default Profile;