import { Box, Button, Card, CardActions, CardContent, FormControlLabel, Icon, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { auth } from '../auth/auth-helper'
import { read, update } from './api-user';
import { Navigate, useParams } from 'react-router-dom'
import theme from '../../theme';

const sxStyle = {
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(12),
        paddingBottom: theme.spacing(2)
    },
    title: {
        margin: theme.spacing(2),
        color: theme.palette.protectedTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        margin: 0.4,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '97%'
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    },
    checked: {
        color: 'blue'
    },
    bar: {
        color: 'red'
    }

}

const EditProfile = () => {
    let { userId } = useParams()
    console.log("EditProfile Component: " + userId)
    const [userID, setUserID] = useState(userId || undefined)

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        open: false,
        error: '',
        redirectToProfile: false,
        educator: false
    });

    const jwt = auth.isAuthenticated();


    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            userId: userID
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, name: data.name, email: data.email, educator: data.educator })
            }
        })

        return function cleanup() {
            abortController.abort()
        }
    }, [userID])

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            educator: values.educator
        }

        update({
            userId: userID
        }, {
            t: jwt.token
        }, user).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                auth.updateUser(data, () => {
                    setValues({ ...values, userId: data._id, redirectToProfile: true })
                })
            }
        })
    };

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const handleCheck = (event, checked) => {
        setValues({ ...values, 'educator': checked })
    }

    if (values.redirectToProfile) {
        return (<Navigate to={'/user/:' + values.userId} />)
    }


    return (
        <Card sx={sxStyle.card}>
            <CardContent>
                <Typography variant="h6" sx={sxStyle.title}>
                    Edit Profile
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <TextField sx={sxStyle.textField} id="name" label="Name" value={values.name || ''} onChange={handleChange('name')} />
                    <TextField sx={sxStyle.textField} id="email" label="Email" value={values.email || ''} onChange={handleChange('email')} />
                    <TextField sx={sxStyle.textField} id="password" label="Password" value={values.password || ''} onChange={handleChange('password')} />
                    <br />
                    <Typography variant="subtitle1" >
                        I am an Educator
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                // classes={{
                                //     checked: classes.checked,
                                //     bar: classes.bar,
                                // }}
                                checked={values.educator}
                                onChange={handleCheck}
                            />
                        }
                        label={values.educator ? 'Yes' : 'No'}
                    />
                    {
                        values.error && (
                            <Typography component="p" color="error">
                                <Icon color='error'>error</Icon>
                                {values.error}
                            </Typography>
                        )
                    }
                </Box>
            </CardContent>
            <CardActions>
                <Button variant='contained' onClick={clickSubmit} >Submit</Button>
            </CardActions>
        </Card>
    )
}

export default EditProfile;