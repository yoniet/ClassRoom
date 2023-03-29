import { Button } from '@mui/material'
import React, { useState } from 'react'
import { Navigate } from 'react-router'
import { auth } from '../auth/auth-helper'
import { create } from './api-enrollment'

const Enroll = (props) => {

    const [values, setValues] = useState({
        enrollmentId: '',
        error: '',
        redirect: false
    })

    const clickEnroll = () => {
        const jwt  = auth.isAuthenticated()
        
        create({
            courseId: props.courseId
        }, {t: jwt.token}).then((data)=> {
            console.log(data)
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, enrollmentId: data._id, redirect: true})
            }
        })
    }

    if (values.redirect) {
        return (<Navigate to={'/learn/' + values.enrollmentId} />)
    }

    return (<>
        <Button variant='contained' color='secondary' onClick={clickEnroll}> Enroll </Button>
        </>
    )
}

export default Enroll;

