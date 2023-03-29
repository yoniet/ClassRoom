import { CheckCircle, Info, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Avatar, Button, Card, CardHeader, CardMedia, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import theme from '../../theme';
import { auth } from '../auth/auth-helper';
import { read } from './api-enrollment';


const sxStyle = {

    root: {
        maxWidth: 800,
        margin: 'auto',
        marginTop: theme.spacing(12),
        marginLeft: 250
    },
    heading: {
        marginBottom: theme.spacing(3),
        fontWeight: 200
    },
    flex: {
        // display: 'flex',
        marginBottom: 20
    },
    card: {
        padding: '24px 40px 20px'
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
    avatar: {
        color: '#9b9b9b',
        border: '1px solid #bdbdbd',
        background: 'none'
    },
    media: {
        height: 180,
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
        margin: '8px 24px',
        display: 'inline-block'
    },
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 240,
        backgroundColor: '#616161'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    selectedDrawer: {
        backgroundColor: '#e9e3df'
    },
    unselected: {
        backgroundColor: '#ffffff'
    },
    check: {
        color: '#38cc38'
    },
    subhead: {
        fontSize: '1.2em'
    },
    progress: {
        textAlign: 'center',
        color: '#dfdfdf',
        '& span': {
            color: '#fffde7',
            fontSize: '1.15em'
        }
    },
    para: {
        whiteSpace: 'pre-wrap'
    }
}



const Enrollment = () => {
    let { enrollmentId } = useParams()

    const [enrollment, setEnrollment] = useState({ course: { instructor: [] }, lessonStatus: [] })
    const [values, setValues] = useState({
        error: '',
        drawer: -1
    })
    const [totalComplete, setTotalComplete] = useState(0)

    const jwt = auth.isAuthenticated()
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({ enrollmentId: enrollmentId }, { t: jwt.token }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                totalCompleted(data.lessonStatus)
                setEnrollment(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [enrollmentId])

    const totalCompleted = (lessons) => {
        let count = lessons.reduce((total, lessonStatus) => {
            return total + (lessonStatus.complete ? 1 : 0)
        }, 0)
        setTotalComplete(count)
        return count
    }

    const selectDrawer = (index) => event => {
        setValues({ ...values, drawer: index })
    }

    const imageUrl = enrollment.course._id
        ? `/api/courses/photo/${enrollment.course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto'

    return (
        <div style={sxStyle.root}>

            <Drawer
                variant='permanent'
                classes={{
                    paper: sxStyle.drawerPaper
                }}

            ><div style={sxStyle.toolbar} />
                <List>
                    <ListItem button onClick={selectDrawer(-1)} sx={values.drawer == -1 ? sxStyle.selectedDrawer : sxStyle.unselected}>
                        <ListItemIcon><Info /></ListItemIcon>
                        <ListItemText primary={'Course Overview'} />
                    </ListItem>
                </List>
                <Divider />
                <List sx={sxStyle.unselected}>
                    <ListSubheader component='div' sx={sxStyle.subhead}>
                        Lessons
                    </ListSubheader>
                    {enrollment.lessonStatus.map((lesson, index) => (
                        <ListItem button key={index} onClick={selectDrawer(index)} sx={values.drawer == index ? sxStyle.selectedDrawer : sxStyle.unselected}>
                            <ListItemAvatar>
                                <Avatar sx={sxStyle.avatar}>
                                    {index + 1}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={enrollment.course.lessons[index].title} />
                            <ListItemSecondaryAction>
                                {lesson.complete ? <CheckCircle sx={sxStyle.check} /> : <RadioButtonUnchecked />}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemText
                            primary={<div style={sxStyle.progress}><span>{totalComplete}</span> out of <span>{enrollment.lessonStatus.length}</span>
                                completed
                            </div>}
                        />
                    </ListItem>
                </List>
            </Drawer>
            {values.drawer == -1 &&
                <Card sx={sxStyle.card}>
                    <CardHeader
                        title={enrollment.course.name}
                        subheader={<div>
                            <Link to={"/user/" + enrollment.course.instructor._id} style={{ textDecoration: 'none', color: 'inherit' }} sx={sxStyle.sub}>
                                By {enrollment.course.instructor.name}&nbsp;
                            </Link>
                            <span style={sxStyle.category}>{enrollment.course.category}</span>
                        </div>}
                        action={
                            totalComplete == enrollment.lessonStatus.length &&
                            (<span style={sxStyle.action}>
                                <Button variant='contained' color='secondary'>
                                    <CheckCircle /> &nbsp; Completed
                                </Button>
                            </span>)
                        }
                    />
                    <div style={sxStyle.flex}>
                        <CardMedia
                            sx={sxStyle.media}
                            image={imageUrl}
                            title={enrollment.course.name}
                        />
                        <div style={sxStyle.details}>
                            <Typography variant='body1' sx={sxStyle.subheading}>
                                {enrollment.course.description}<br />
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <CardHeader
                            title={<Typography variant='h6' sx={sxStyle.subheading}>Lessons</Typography>}
                            subheader={<Typography variant='body1' sx={sxStyle.subheading}>
                                {enrollment.course.lessons && enrollment.course.lessons.length} lessons
                            </Typography>}
                            action={
                                auth.isAuthenticated().user && auth.isAuthenticated().user._id == enrollment.course.instructor._id &&
                                (<span style={sxStyle.action}>

                                </span>)
                            }
                        />
                        <List>
                            {enrollment.course.lessons && enrollment.course.lessons.map((lesson, i) => {
                                return (<span key={i}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {i + 1}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={lesson.title} />
                                    </ListItem>
                                    <Divider variant='inset' component='li' />
                                </span>)
                            })}
                        </List>
                    </div>
                </Card>
            }
            {values.drawer != -1 && (<>
                <Typography variant='h5' sx={sxStyle.heading}>{enrollment.course.name}</Typography>
                <Card sx={sxStyle.card}>
                    <CardHeader
                        title={enrollment.course.lessons[values.drawer].title}
                        action={
                            <Button onClick={markComplete}
                                variant={enrollment.lessonStatus[values.drawer].complete
                                    ? 'contained' : 'outlined'} color="secondary">
                                {enrollment.lessonStatus[values.drawer].complete
                                    ? "Completed" : "Mark as complete"}
                            </Button>
                        } />
                </Card>
            </>)}
        </div>
    )
}

export default Enrollment;