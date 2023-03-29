import { FileUpload } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, Icon, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { auth } from '../auth/auth-helper'
import { create } from './api-course';


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
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2),
        textDecoration: 'none'
    },
    input: {
        display: 'none'
    },
    filename: {
        marginLeft: '10px'
    }
}


const NewCourse = () => {

    const [values, setValues] = useState({
        name: '',
        description: '',
        image: '',
        category: '',
        redirect: false,
        error: ''
    })

    const jwt = auth.isAuthenticated()
   

    // This function takes the new value that has been entered into the input 
    // field and sets it to state, including the name of the file if one is uploaded by the user
    const handleChange = name => event => {
        const value = name === 'image'
            ? event.target.files[0]
            : event.target.value
        setValues({ ...values, [name]: value })
    }


    const clickSubmit = () => {
        // first takes the input values from the state and sets it to
        // a 'FormData' objects. This ensures that the data is stored in the correct 
        // format that is needed for the 'multipart/form' encoding type that is necessary for
        // sending requests containing file uploads.
        let courseData = new FormData()
        values.name && courseData.append('name', values.name)
        values.description && courseData.append('description', values.description)
        values.image && courseData.append('image', values.image)
        values.category && courseData.append('category', values.category)

        create({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, courseData).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, error: '', redirect: true })
            }
        })
    }


    // Finally, depending on the response from the server, either
    // an error message is shown, or the user is navigate to the "MyCourses" view
    if (values.redirect) {
        return (<Navigate to={'/teach/courses'} />)
    }

    return (
        <div>
            <Card sx={sxStyle.card}>
                <CardContent >
                    <Typography variant='h6' sx={sxStyle.title}>New Course</Typography><br />
                    <input accept='image/*' onChange={handleChange('image')}
                        style={sxStyle.input} id="icon-button-file" type='file' />
                    <label htmlFor='icon-button-file'>
                        <Button variant='contained' color='secondary' component="span">
                            Upload Photo
                            <FileUpload />
                        </Button>
                    </label>
                    <span style={sxStyle.filename}>{values.image ? values.image.name : ''}</span>
                    <br />
                    <TextField
                        id='name'
                        label='Name'
                        value={values.name} onChange={handleChange('name')}
                        sx={sxStyle.textField}
                    /> <br />
                    <TextField
                        id='multiline-flexible'
                        label='Description'
                        multiline
                        rows="2"
                        value={values.description}
                        sx={sxStyle.textField}
                        onChange={handleChange('description')} /> <br />
                    <TextField
                        id='category'
                        label='Category'
                        value={values.category}
                        sx={sxStyle.textField}
                        onChange={handleChange('category')} /> <br />
                    {
                        values.error && (<Typography component='p' color="error">
                            <Icon color='error' sx={sxStyle.error}>error</Icon>
                            {values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color='primary' variant='contained' onClick={clickSubmit} style={sxStyle.submit}>Submit</Button>
                    <Link to='/teach/courses' style={sxStyle.submit}><Button variant='contained'>Cancel</Button></Link>
                </CardActions>
            </Card>

        </div>
    )
}

export default NewCourse;