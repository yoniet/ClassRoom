import React, { useEffect, useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Avatar, Button, Card, CardHeader, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItemText, Typography, ListItem, ListItemAvatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { auth } from '../auth/auth-helper';
import { read, update } from './api-course';
import DeleteCourse from './DeleteCourse';
import NewLesson from './NewLesson';

const sxStyle = {
    root: {
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
    },
    flex: {
        display: 'flex',
        marginBottom: 20
    },
    card: {
        padding: '24px 40px 40px'
    },
    subheading: {
        margin: '10px',
        color: theme.palette.openTitle
    },
    details: {
        margin: '16px',
    },
    sub: {
        display: 'block',
        margin: '3px 0px 5px 0px',
        fontSize: '0.9em'
    },
    media: {
        height: 190,
        display: 'inline-block',
        width: '100%',
        marginLeft: '16px'
    },
    icon: {
        verticalAlign: 'sub'
    },
    category: {
        color: '#5c5c5c',
        fontSize: '0.9em',
        padding: '3px 5px',
        backgroundColor: '#dbdbdb',
        borderRadius: '0.2em',
        marginTop: 5
    },
    action: {
        margin: '10px 0px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    statSpan: {
        margin: '7px 10px 0 10px',
        alignItems: 'center',
        color: '#616161',
        display: 'inline-flex',
        '& svg': {
            marginRight: 10,
            color: '#b6ab9a'
        }
    },
    enroll: {
        float: 'right'
    }
}

const Course = () => {
    let { courseId } = useParams()
    const [courseID, setCourseID] = useState(courseId || undefined)

    const [course, setCourse] = useState({ instructor: {} })
    const [values, setValues] = useState({
        redirect: false,
        error: ''
    })

    const jwt = auth.isAuthenticated()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({
            courseId: courseID,
        }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [courseID])

    const addLesson = (course) => {
        setCourse(course)
    }

    const clickPublish = () => {
        if (course.lessons.length > 0) {
            setOpen(true)
        }
    }

    const removeCourse = (course) => {
        setValues({ ...values, redirect: true })
    }

    const publish = () => {
        let courseData = new FormData();
        courseData.append('published', true)
        update({
            courseId: courseID
        }, { t: jwt.token }, courseData).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse({ ...course, published: true })
                setOpen(false)
            }
        })
    }


    const handleClose = () => {
        setOpen(false);
    }

    // 'imageUrl' consists of the route that will retrieve 
    // the course image as a file response
    const imageUrl = course._id
        ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto'

    return (
        <div style={sxStyle.root}>
            <Card sx={sxStyle.card}>
                <CardHeader
                    title={course.name}
                    subheader={<div>
                        <Link to={"/user/" + course.instructor._id} style={sxStyle.sub}>
                            By {course.instructor.name}
                        </Link>
                        <span style={sxStyle.category}>{course.category}</span>
                    </div>
                    }
                    action={<>
                        {
                            auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id &&
                            (<span style={sxStyle.action}>
                                <Link to={"/teach/course/edit/" + course._id}>
                                    <IconButton aria-label='Edit' color='secondary'>
                                        <Edit />
                                    </IconButton>
                                </Link>
                                {!course.published ? (<>
                                    <Button color='secondary' variant='outlined' onClick={clickPublish}>
                                        {course.lessons.length == 0 ? "Add at least 1 lesson to publish" : "Publish"}
                                    </Button>
                                    <DeleteCourse course={course} onRemove={removeCourse} />
                                </>) : (
                                    <Button color='primary' variant='outlined'>Published</Button>
                                )}
                            </span>)
                        }
                    </>}
                />
                <div style={sxStyle.flex}>
                    <CardMedia sx={sxStyle.media} image={imageUrl} title={course.name} />
                </div>
                <div style={sxStyle.details}>
                    <Typography variant='body1' sx={sxStyle.subheading}>
                        {course.description}<br />
                    </Typography>

                </div>
                <Divider />
                <div>
                    <CardHeader
                        title={<Typography variant='h6' sx={sxStyle.subheading}>Lessons</Typography>}
                        subheader={<Typography variant='body1' sx={sxStyle.subheading}>
                            {course.lesson && course.lessons.length} lesson
                        </Typography>}
                        action={
                            auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.instructor._id && !course.published &&
                            (<span style={sxStyle.action}>
                                <NewLesson courseId={course._id} addLesson={addLesson} />
                            </span>)
                        }
                    />
                    <List>
                        {
                            course.lessons && course.lessons.map((lesson, index) => {
                                return (<span key={index}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {index + 1}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={lesson.title}
                                        />
                                    </ListItem>
                                    <Divider variant='inset' component="li" />
                                </span>)
                            })
                        }
                    </List>
                </div>
            </Card>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
                <DialogContent >
                    <Typography variant='body1'>Publish your course will make it live to students for enrollment. </Typography>
                    <Typography variant='body1'>Make sure all lessons are added and ready for publishing. </Typography>
                </DialogContent>
                <DialogActions >
                    <Button onClick={handleClose} color='primary' variant='contained'>Cancel</Button>
                    <Button onClick={publish} color='secondary' variant='contained'>Publish</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Course;