import React from 'react'
import { Routes, Route } from "react-router-dom";
import Menu from './components/core/Menu'
import Home from './components/core/Home'
import Users from './components/users/Users'
import SignUp from './components/users/SignUp'
import Profile from './components/users/Profile'
import EditProfile from './components/users/EditProfile';
import NotFound from './NotFound';
import PrivateRoutes from './components/auth/PrivateRoutes';
import SignIn from './components/auth/SignIn';
import MyCourses from './components/course/MyCourses';
import Course from './components/course/Course'
import EditCourse from './components/course/EditCourse';
import NewCourse from './components/course/NewCourse';
import Enrollment from './components/enrollment/enrollment';

const MainRouter = (props) => {
  return (<div>

    <Menu />

    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path='/course/:courseId' element={<Course />} />

      <Route
        element={<PrivateRoutes />}
      >
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/user/edit/:userId" element={<EditProfile />} />
        <Route path="/teach/courses" element={<MyCourses />} />
        <Route path="/teach/course/edit/:courseId" element={<EditCourse />} />
        <Route path="/teach/course/:courseId" element={<Course />} />
        <Route path="/teach/course/new" element={<NewCourse />} />
        <Route path='/learn/:enrollmentId' element={<Enrollment />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>)
}

export default MainRouter;