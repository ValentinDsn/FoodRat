import React, { useState } from 'react';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBInput,
    MDBCheckbox,
    MDBCard,
    MDBCardBody,
} from 'mdb-react-ui-kit';

import foodWaste from '../assets/img/ratv2.jpg';

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
const serverURL = process.env.REACT_APP_SERVER_URL;


function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onSubmit = async (values) => {
        try {
            const response = await axios.post(`${serverURL}/application/login`, values);
            signIn({
                token: response.data.token,
                expiresIn: response.data.expiresIn,
                tokenType: "Bearer",
                authState: {
                    email: response.data.email,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname
                },
                refreshToken: response.data.refreshToken,
                refreshTokenExpireIn : response.data.refreshTokenExpireIn
            });
            toast("Login successful!", { type: "success" });
            navigate("/");
        } catch (err) {
            if (err && err.response) {
                if (err.response.status === 400) {
                    setError(err.response.data); // Utilisez le message d'erreur renvoyé par le serveur
                } else {
                    setError("An error occurred. Please try again.");
                }
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit,
    });

    const register = () => {
        navigate("/register");
    }

    return (
            <MDBContainer fluid className="p-2 my-2 h-custom">
                <h1 className="home-main-text">Welcome to FoodRat</h1>
                <h2 className="home-secondary-text">The anti-waste application</h2>
                <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol col='10' md='6'>
                                <img src={foodWaste} className="login-main-img" alt="Sample" />
                            </MDBCol>
                            <MDBCol col='4' md='6' className="login-main-form">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={formik.handleSubmit}>
                                    <MDBInput
                                        name="email"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                        wrapperClass='mb-4'
                                        label='Email address'
                                        id='emailformControl'
                                        type='email'
                                        size="lg"
                                    />
                                    <MDBInput
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        wrapperClass='mb-4'
                                        label='Password'
                                        id='passwordformControl'
                                        type='password'
                                        size="lg"
                                    />
                                    <div className="d-flex justify-content-between mb-4">
                                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                                        <a href="/login">Forgot password?</a>
                                    </div>
                                    <div className='text-center text-md-start mt-4 pt-2'>
                                        <input value='Login' className='btn btn-primary' type='submit'/>
                                        <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="/register" onClick={register} className="link-danger">Register</a></p>
                                    </div>
                                </form>
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
    );
}

export default Login;
