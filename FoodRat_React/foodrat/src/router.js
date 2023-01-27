import {Routes, Route} from "react-router-dom";
import React from 'react';
// import {Home, Settings} from './routes/index'
import Home from './pages/Home'
import Scan from './pages/Scan'
function MyRouter() {
    return(
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/home" element={<Home />}/>
                <Route  path="/scan" element={<Scan />}/>
            </Routes>



    )
}


export default MyRouter