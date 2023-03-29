import React, { useState } from 'react';
import { Delete } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import PropTypes from 'prop-types'
import { auth } from '../auth/auth-helper';
import { remove } from './api-course';

const DeleteCourse = (props) => {

    const [open, setOpen] = useState(false)
    
    const jwt = auth.isAuthenticated();
    const clickButton = () => {
        setOpen(true);
    }

    const deleteCourse = () => {
        remove({
            courseId: props.course._id
        }, {t: jwt.token}).then((data)=> {
            if (data.error) {
                console.log(data.error)
            } else {
                setOpen(false)
                props.onRemove(props.course)
            }
        })
    }

    const handleRequestClose = () => {
        setOpen(false);
    }

    return (<span>
        <IconButton aria-label='Delete' onClick={clickButton} color='secondary'>
            <Delete />
        </IconButton>

        <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete ' + props.course.name}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Confirm to delete your course {props.course.name}.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleRequestClose} color='primary'>
                Cancel
            </Button>
            <Button onClick={deleteCourse} color='secondary' autoFocus='autoFocus'>
                Confirm
            </Button>
        </DialogActions>

        </Dialog>
    </span>
    )
}

export default DeleteCourse;

DeleteCourse.propTypes = {
    course: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}