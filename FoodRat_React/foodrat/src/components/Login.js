import React, { useState } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import foodWaste from '../assets/img/rat.png';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Login.css';

function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onSubmit = async (values) => {
        try {
            const response = await axios.post("http://localhost:3000/application/login", values);
            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: {
                    email: values.email,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname
                },
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
            <MDBContainer fluid className="p-3 my-5 h-custom">
                <MDBRow>
                    <MDBCol col='10' md='6'>
                        <p className="MainText">Welcome to FoodRat</p>
                        <img src={foodWaste} className="MainImg" alt="Sample image" />
                    </MDBCol>
                    <MDBCol col='4' md='6' className={"MainForm"}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={formik.handleSubmit}>
                            <MDBInput
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                wrapperClass='mb-4'
                                label='Email address'
                                id='formControlLg'
                                type='email'
                                size="lg"
                            />
                            <MDBInput
                                name="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                wrapperClass='mb-4'
                                label='Password'
                                id='formControlLg'
                                type='password'
                                size="lg"
                            />
                            <div className="d-flex justify-content-between mb-4">
                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                                <a href="!#">Forgot password?</a>
                            </div>
                            <div className='text-center text-md-start mt-4 pt-2'>
                                <input value='Login' className='btn btn-primary' type='submit'/>
                                <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="#!" onClick={register} className="link-danger">Register</a></p>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
    );
}

export default Login;