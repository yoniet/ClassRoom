import { Box, Card, TextField, Typography, CardContent, CardActions, Button, Icon } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom'
import React, { useState } from 'react';
import { signin } from './api-auth';
import { auth } from './auth-helper';
import theme from '../../theme';

const sxStyle = {
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(12),
        paddingBottom: theme.spacing(2)
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        margin: 0.4,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 350,
        padding: 'auto',
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}

const SignIn = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false
    })


    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        }

        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                auth.authenticate(data, () => {
                    setValues({ ...values, error: '', redirectToReferrer: true })
                })
            }
        })
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }



    const { from } = {
        from: {
            pathname: '/'
        }
    }

    const { redirectToReferrer } = values;

    if (redirectToReferrer) {
        return (<Navigate to={from} />)
    }

    return (
        <Card sx={sxStyle.card}>
            <CardContent>
                <Typography variant="h6" sx={sxStyle.title}>
                    Sign In
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <TextField sx={sxStyle.textField} id="email" type="email" label="Email" value={values.email} onChange={handleChange('email')} />
                    <TextField sx={sxStyle.textField} id="password" type="password" label="Password" value={values.password} onChange={handleChange('password')} />
                </Box>
                {
                    values.error &&
                    (
                        <Typography component="p" color="error">
                            <Icon color="error" sx={sxStyle.error}>error</Icon>
                            <br />
                            {values.error}
                        </Typography>
                    )
                }
            </CardContent>
            <CardActions>
                <Button sx={sxStyle.submit} variant='contained' onClick={clickSubmit}>Submit</Button>
            </CardActions>
        </Card>
    )

}

export default SignIn