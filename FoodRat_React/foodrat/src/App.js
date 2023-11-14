import './App.css';
import React from 'react';
import {AuthProvider} from "react-auth-kit";
import refreshApi from "./API/refreshApi";
import MainRoutes from "./router";
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <AuthProvider
            authType={"localstorage"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={window.location.protocol === "https:"}
            refresh={refreshApi}
        >
            <MainRoutes/>
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
