import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { BiUser } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";


import { useFormik } from "formik";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {toast} from "react-toastify";
import foodWaste from '../assets/img/ratv3.jpg';
import './Register.css'
import React, {useState} from "react";
const serverURL = process.env.REACT_APP_SERVER_URL;


function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    const onSubmit = async (values) => {
        try {
            await axios.post(

                `${serverURL}/application/register`,
                values
            );
            toast("Register successful!", { type: "success" });
            navigate("/");
        } catch (err) {
            if (err && err.response) {
                if (err.response.status === 400 || err.response.status === 409) {
                    setError(err.response.data);
                } else {
                    setError("An error occurred. Please try again.");
                }
            }

            if (err && err instanceof AxiosError)
                toast(err.response?.data, { type: "error" });
            else if (err && err instanceof Error) toast(err.message, { type: "error" });
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            firstname: "",
            lastname: ""
        },
        onSubmit
    });

    const login = () => {
        navigate("/login");
    }

    return (
        <MDBContainer fluid>
            <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={formik.handleSubmit}>
                                    <div className="d-flex flex-row align-items-center mb-4 ">
                                        <BiUser className={"register-btn-img"}/>

                                        <MDBInput
                                            name="firstname"
                                            value={formik.values.firstname}
                                            onChange={formik.handleChange}
                                            placeholder="First name*"
                                            size="large"
                                            type="text"
                                            required
                                        />
                                    </div>

                                <div className="d-flex flex-row align-items-center mb-4 ">
                                    <BiUser className={"register-btn-img"}/>
                                    <MDBInput
                                        name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        placeholder="Last name*"
                                        size="large"
                                        type="text"
                                        required
                                    />
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4 ">
                                    <AiOutlineMail className={"register-btn-img"}/>

                                    <MDBInput
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    placeholder="Email*"
                                    size="large"
                                    type="email"
                                    required
                                />
                                </div>
                                <div className="d-flex flex-row align-items-center mb-4 ">
                                    <RiLockPasswordLine className={"register-btn-img"}/>
                                    <MDBInput
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    placeholder="Password*"
                                    size="large"
                                    type="password"
                                    required
                                />
                                </div>

                                <div className="register-container">
                                    <input value='Register' className='mt-2 btn btn-primary' type='submit'/>
                                </div>

                                <div className="register-container">
                                    <p className="small fw-bold mt-2 pt-1 mb-2">Already have an account? <a href="/login" onClick={login} className="link-danger">Login</a></p>
                                </div>

                            </form>
                        </MDBCol>
                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <img src={foodWaste} className="register-main-img" alt="Sample" />
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

        </MDBContainer>
    );
}

export default Register;