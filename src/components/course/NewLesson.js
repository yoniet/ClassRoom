import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { auth } from '../auth/auth-helper';
import { newLesson } from './api-course';

const sxStyle = {
    form: {
        minWidth: 500
    }
}

const NewLesson = (props) => {
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState({
        title: '',
        content: '',
        resource_url: ''
    })

    const clickSubmit = () => {
        const jwt = auth.isAuthenticated()
        const lesson = {
            title: values.title || undefined,
            content: values.content || undefined,
            resource_url: values.resource_url || undefined
        }

        newLesson({
            courseId: props.courseId
        }, {
            t: jwt.token
        }, lesson).then((data) => {
            if (data && data.error) {
                setValues({...values, error: data.error})
            } else {
                props.addLesson(data)
                setValues({...values,
                    title: '',
                    content: '',
                    resource_url: ''
                })
                setOpen(false)
            }
        })
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    return (
        <div>
            <Button aria-label='Add Lesson' color='primary' variant='contained'
                onClick={handleClickOpen}>
                <Add />
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <div style={sxStyle.form}>
                    <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>

                    <DialogContent>

                        <TextField label="Title" type="text" fullWidth
                            value={values.title} onChange={handleChange('title')}
                        /><br />
                        <TextField label="Content" type="text" multiline rows="5" fullWidth
                            value={values.content} onChange={handleChange('content')}
                        /><br />
                        <TextField label="Resource link" type="text" fullWidth
                            value={values.resource_url} onChange={handleChange('resource_url')}
                        /><br />

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}
                            color="primary" variant='contained'>
                            Cancel
                        </Button>
                        <Button onClick={clickSubmit}
                            color='secondary' variant='contained'>
                            Add
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )

}

export default NewLesson;
