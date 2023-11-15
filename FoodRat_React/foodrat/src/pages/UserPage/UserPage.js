import React, {useEffect, useState} from "react";
import {MDBCard, MDBCardBody,  MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import "./UserPage.css"
import {useAuthHeader, useAuthUser} from "react-auth-kit";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";

const serverURL = process.env.REACT_APP_SERVER_URL;

function UserProfile() {
    const auth = useAuthUser()
    const authHeader = useAuthHeader();

    const [initialValues, setInitialValues] = useState({
        email: '',
        firstname: '',
        lastname: '',
    });

    const onSubmit = async (values) => {
        const fieldsToUpdate = {};

        const formattedValues = {
            email: values.email.toLowerCase(),
            firstname: values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1).toLowerCase(),
            lastname: values.lastname.charAt(0).toUpperCase() + values.lastname.slice(1).toLowerCase(),
        };

        Object.keys(initialValues).forEach(key => {
            if (formattedValues[key] !== initialValues[key]) {
                fieldsToUpdate[key] = formattedValues[key];
                console.log(fieldsToUpdate[key])
            }
        });

        if (Object.keys(fieldsToUpdate).length === 0) {
            toast("No info to update", { type: "warning" });

        }else {
            try {
                await axios.patch(`${serverURL}/application/user/updateUser/`, fieldsToUpdate,
                    {headers: {"Authorization": authHeader()}
                    });

                setInitialValues(prevValues => ({
                    ...prevValues,
                    ...fieldsToUpdate
                }));

                formik.resetForm({
                    values: { ...formik.values, ...fieldsToUpdate },
                });


                toast("User correctly updated", { type: "success" });
            } catch (error) {
                toast("Error when update User", { type: "error" });

            }
        }



    }

    const formik = useFormik({
        initialValues: {
            email: '',
            firstname : '',
            lastname : '',
        },
        onSubmit,
    });

    useEffect(() => {
            axios.get(`${serverURL}/application/getUserInfo`, {headers: {"Authorization": authHeader()}})
            .then(response => {
                formik.setFieldValue('email', response.data.email);
                formik.setFieldValue('firstname', response.data.firstname);
                formik.setFieldValue('lastname', response.data.lastname);
                setInitialValues({
                    email : response.data.email,
                    firstname : response.data.firstname,
                    lastname : response.data.lastname
                })
            })
            .catch(error => {
                console.error('There was an error fetching the user info:', error);
            });
    }, []);


    return (
        <MDBContainer fluid className="p-2 my-2 h-custom">
            <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
                <h1 className="user-main-text">Welcome {auth().firstname} !</h1>
                <MDBCardBody>
                    <MDBRow>
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
                                name="firstname"
                                onChange={formik.handleChange}
                                value={formik.values.firstname}
                                wrapperClass='mb-4'
                                label='Firstname'
                                id='firstnameformControl'
                                type='firstname'
                                size="lg"
                            />
                            <MDBInput
                                name="lastname"
                                onChange={formik.handleChange}
                                value={formik.values.lastname}
                                wrapperClass='mb-4'
                                label='Lastname'
                                id='lastnameformControl'
                                type='Lastname'
                                size="lg"
                            />

                            <div className='text-center text-md-start mt-4 pt-2'>
                                <input value='Update infos' className='btn btn-primary' type='submit'/>
                            </div>
                        </form>
                    </MDBRow>

                </MDBCardBody>
                <p className="user-text-note">* The email will be put in lower case and the lastname/firstname with the first letter in upper case before sending to the server.</p>
            </MDBCard>
        </MDBContainer>

    )
}

export default UserProfile;