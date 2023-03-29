import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import theme from '../../theme'
import CardMedia from '@mui/material/CardMedia'
import { auth } from '../auth/auth-helper';
import Courses from '../course/Courses';
import { listPublished } from '../course/api-course';


const sxStyle = {
    card: {
        width: '90%',
        margin: 'auto',
        marginTop: 20,
        marginBottom: theme.spacing(2),
        padding: 2,
        backgroundColor: '#ffffff'
    },
    extraTop: {
        marginTop: theme.spacing(12)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    },
    enrolledTitle: {
        color:'#efefef',
        marginBottom: 5
      },
}

const Home = () => {

    const [courses, setCourses] = useState();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        listPublished(signal).then((data) => {
            if (false) {
                console.log(data.error)
            } else {
                setCourses(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

  
    return (
        <div style={sxStyle.extraTop}>
            <Card sx={sxStyle.card}>
                <Courses courses={courses} />
            </Card>
        </div>
    )
}

export default Home;