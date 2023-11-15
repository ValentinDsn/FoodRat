import {Routes, Route} from "react-router-dom";
import {RequireAuth} from "react-auth-kit";
import React from 'react';

import Home from '../pages/HomePage/Home'
import Scan from '../pages/ScanPage/Scan'
import AllProducts from '../pages/AllProductsPage/AllProductsList'
import Login from "../pages/LoginPage/Login";
import Register from "../pages/RegisterPage/Register";
import UserProfile from "../pages/UserPage/UserPage";


function MainRoutes() {
    return (
            <Routes>
                <Route path="/" element={<RequireAuth loginPath="/login"><Home/></RequireAuth>}/>
                <Route path="/home" element={<RequireAuth loginPath="/login"><Home/></RequireAuth>}/>
                <Route path="/scan" element={<RequireAuth loginPath="/login"><Scan/></RequireAuth>}/>
                <Route path="/allProducts" element={<RequireAuth loginPath="/login"><AllProducts/></RequireAuth>}/>
                <Route path="/userProfile" element={<RequireAuth loginPath="/login"><UserProfile/></RequireAuth>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
    )
}


export default MainRoutes