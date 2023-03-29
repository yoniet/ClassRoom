import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'

import { auth } from './auth-helper';



const PrivateRoutes = () => {
    let authToken = auth.isAuthenticated() ? true : false
    return authToken ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoutes;