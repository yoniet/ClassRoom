import { Delete } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { auth } from '../auth/auth-helper';
import { remove } from './api-user';
import { Navigate } from 'react-router-dom';
// import PropTypes  from 'prop-types';


const DeleteUser = (props) => {
    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false)

    const jwt = auth.isAuthenticated()

    const clickButton = () => {
        setOpen(true)
    }

    const deleteAccount = ()=> {
        remove({
            userId: props.userId
        }, {t: jwt.token}).then((data)=> {
            if (data && data.error) {
                console.error(data.error)
            } else {
                auth.clearJWT(()=> console.log('deleted'))
                setRedirect(true)
            }
        })
    }

    const handleRequestClose = () => {
        setOpen(false);
    }

    if (redirect) {
        return <Navigate to='/' />
    }

    return (
        <span>
        <IconButton aria-label='Delete' onClick={clickButton} color="secondary">
            <Delete/>
        </IconButton>

        <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Confirm to delete your account.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleRequestClose} >
                Cancel
            </Button>
            <Button onClick={deleteAccount} color='secondary' autoFocus='autoFocus'>
                Confirm
            </Button>
        </DialogActions>
        </Dialog>
        </span>
    )
}

export default DeleteUser;