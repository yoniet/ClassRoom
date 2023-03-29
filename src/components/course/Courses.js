import { Button, Grid, IconButton, ImageListItem, ImageListItemBar, } from '@mui/material';
import theme from '../../theme';
import React from 'react';
import { Link } from 'react-router-dom';
import Enroll from '../enrollment/Enroll';
import { auth } from '../auth/auth-helper';

const sxStyle = {
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    gridList: {
        width: '100%',
        minHeight: 200,
        padding: '16px 0 0px'
    },
    tile: {
        textAlign: 'center',
        border: '1px solid #cecece',
        backgroundColor: '#04040c'
    },
    image: {
        height: '280px',
    },
    action: {
        margin: '0 10px'
    },
    tileBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        textAlign: 'left'
    },
    tileTitle: {


    },
}

const Courses = (props) => {

    return (
        <Grid
            container
            spacing={2}
        >
            {props.courses &&
                props.courses.map((course, i) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} key={i} >
                            <ImageListItem sx={sxStyle.tile}>
                                <img src={'/api/courses/photo/' + course._id} style={sxStyle.image} loading='lazy' />
                                <ImageListItemBar sx={sxStyle.tileBar}
                                    title={<Link to={"/course/" + course._id} style={{
                                        fontSize: '1.1em',
                                        marginBottom: '5px',
                                        textDecoration: 'none',
                                        color: 'white',
                                        display: 'block',
                                    }}>{course.name}</Link>}
                                    subtitle={<span>{course.category}</span>}
                                    actionIcon={<div style={sxStyle.action}>
                                        <IconButton>
                                            {auth.isAuthenticated() ? <Enroll courseId={course._id} /> 
                                                : <Button variant='contained' color='warning'><Link style={{textDecoration: 'none', color:'white'}} to={'/signin'}>Sign in to Enroll</Link></Button>
                                            }
                                        </IconButton>
                                    </div>}
                                />
                            </ImageListItem>
                        </Grid>
                    )
                })
            }
        </Grid>

    )
}

// Courses.propTypes = {
//     courses: PropTypes.array.isRequired
// }

export default Courses;