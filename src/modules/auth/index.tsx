import React from 'react';
import { Route, Routes } from "react-router-dom";
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';

const AuthModule: React.FC = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register">
                <Route path="new-user" element={<Register />} />
            </Route>
        </Routes>
    )
}

export default AuthModule;