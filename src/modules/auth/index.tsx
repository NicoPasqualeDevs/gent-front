import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import LoadingFallback from '@/components/LoadingFallback';

const AuthModule: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register">
                    <Route path="new-user" element={<Register />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AuthModule;