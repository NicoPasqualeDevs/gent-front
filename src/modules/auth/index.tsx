import React from 'react';
import { Route, Routes, Outlet } from "react-router-dom";
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import BuilderLayout from '@/components/Layouts/Builder/BuilderLayout';

const BuilderL = (
    <BuilderLayout>
      <Outlet />
    </BuilderLayout>
  );

const AuthModule: React.FC = () => {

    return (
        <Routes>
            <Route path='/'>
                <Route path='login' element={<Login />} />
            </Route>
            <Route path='/register/' element={BuilderL}>
                <Route path='new-user' element={<Register />} />
            </Route>
        </Routes>
    )
}

export default AuthModule