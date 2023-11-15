import './App.css';
import React from 'react';
import {AuthProvider} from "react-auth-kit";
import refreshApi from "./API/refreshApi";
import MainRoutes from "./Routes/router";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar/Navbar";
import MayRenderNavbar from "./components/Navbar/mayRenderNavbar";
import {BrowserRouter} from "react-router-dom";


function App() {
    return (
        <AuthProvider
            authType={"cookie"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={window.location.protocol === "https:"}
            refresh={refreshApi}
        >
            <BrowserRouter>
                <MayRenderNavbar>
                    <Navbar/>
                </MayRenderNavbar>
                <MainRoutes/>
            </BrowserRouter>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"/>
        </AuthProvider>

    );
}

export default App;
