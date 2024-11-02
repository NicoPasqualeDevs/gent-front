import React from 'react';
import { Route, Routes } from "react-router-dom";
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';

const AuthModule: React.FC = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register/new-user" element={<Register />} />
        </Routes>
    )
}

export default AuthModule;