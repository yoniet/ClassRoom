import { Avatar, Button, Divider, Icon, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { auth } from '../auth/auth-helper';
import { listByInstructor } from './api-course.js';
import AddIcon from '@mui/icons-material/Add';

const sxStyle = {
    root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(12)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  avatar: {
    borderRadius: 0,
    width:65,
    height: 40
  },
  listText: {
    marginLeft: 16
  }
}

const MyCourses = () => {

    const [courses, setCourses] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = auth.isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listByInstructor({
            userId: jwt.user._id
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true)
            } else {
                setCourses(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    if (redirectToSignin) {
        return <Navigate to={'/signin'} />
    }

    return (
        <div>
            <Paper sx={sxStyle.root} elevation={4}>
                <Typography type='title' sx={sxStyle.title} >
                    Your Courses
                    <span style={sxStyle.addButton}>
                        <Link to='/teach/course/new' style={{textDecoration: 'none'}}>
                            <Button color='primary' variant='contained'>
                                <AddIcon sx={sxStyle.leftIcon}></AddIcon> New Course
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <List dense>
                    {courses && courses.map((course, i) => {
                        return <Link to={"/teach/course/" + course._id} key={i} style={{'textDecoration': 'none'}}>
                            <ListItem >
                                <ListItemAvatar>
                                    <Avatar src={'/api/courses/photo/' + course._id + "?" + new Date().getTime()} sx={sxStyle.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={course.name} secondary={course.description} sx={sxStyle.listText} />
                            </ListItem>
                            <Divider />
                        </Link>
                    })}
                </List>
            </Paper>
        </div>)
}

export default MyCourses;