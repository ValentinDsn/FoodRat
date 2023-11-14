import {Routes, Route, BrowserRouter} from "react-router-dom";
import React from 'react';
// import {Home, Settings} from './routes/index'
import Home from './pages/Home'
import Scan from './pages/Scan'
import AllProducts from './pages/AllProductsList'
import {RequireAuth} from "react-auth-kit";
import Login from "./components/Login";
import Register from "./components/Register";

function MainRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RequireAuth loginPath="/login"><Home/></RequireAuth>}/>
                <Route path="/home" element={<RequireAuth loginPath="/login"><Home/></RequireAuth>}/>
                <Route path="/scan" element={<RequireAuth loginPath="/login"><Scan/></RequireAuth>}/>
                <Route path="/allProducts" element={<RequireAuth loginPath="/login"><AllProducts/></RequireAuth>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </BrowserRouter>


    )
}


export default MainRoutes