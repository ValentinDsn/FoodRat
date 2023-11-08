import { Button } from "baseui/button";
import {
    HeadingXXLarge
} from "baseui/typography";
import {
    Container,
    InnerContainer,
    InputWrapper,
    StyledInput,
    InputWrapperSecondary
} from "./commons";
import { useFormik } from "formik";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import {toast} from "react-toastify";

function Register() {
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            console.log(values);
            const response = await axios.post(

                "http://localhost:3000/application/register",
                values
            );
            toast("Register successful!", { type: "success" });
            navigate("/");
        } catch (err) {
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
        <Container>
            <InnerContainer>
                <form onSubmit={formik.handleSubmit}>
                    <center>
                        <HeadingXXLarge>Welcome !</HeadingXXLarge>
                    </center>
                    <InputWrapper>
                        <StyledInput
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="Email*"
                            clearOnEscape
                            size="large"
                            type="email"
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <StyledInput
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            placeholder="First name*"
                            clearOnEscape
                            size="large"
                            type="text"
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <StyledInput
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            placeholder="Last name*"
                            clearOnEscape
                            size="large"
                            type="text"
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <StyledInput
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Password*"
                            clearOnEscape
                            size="large"
                            type="password"
                            required
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
                            Register
                        </Button>
                    </InputWrapper>
                </form>
                <InputWrapperSecondary>
                    <Button size="compact" kind="secondary" onClick={login}>
                        Login
                    </Button>
                </InputWrapperSecondary>
            </InnerContainer>
        </Container>
    );
}

export default Register;