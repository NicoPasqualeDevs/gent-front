import React from 'react';
import { Route, Routes } from "react-router-dom";
import Login from '@/components/pages/Auth/Login';

const AuthModule: React.FC = () => {

    return (
        <Routes>
            <Route path='/'>
                <Route path='admLogin' element={<Login />} />
            </Route>
        </Routes>
    )
}

export default AuthModule