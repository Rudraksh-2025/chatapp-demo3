import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '../../assets/Whisper.png';
import './login.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../store/useAuthStore';
import LockIcon from '@mui/icons-material/Lock';
import consult from '../../assets/consult.gif';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useChatStore } from '../../store/useChatStore';

const Signup = () => {
    const [showPass, setShowPass] = useState(false);
    const [file, setFile] = useState(null);
    const { signup, isSigningUp } = useAuthStore();
    const { createFile } = useChatStore()

    const validationSchema = yup.object({
        username: yup
            .string('Enter your username')
            .required('Username is required'),
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        confirmPassword: yup
            .string('Confirm your password')
            .oneOf([yup.ref('password'), null], 'Passwords must match') // Add this line
            .required('Confirm Password is required'),
    });


    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const user = {
                login: values.username,
                email: values.email,
                password: values.password,
                blob_id: file,
            };
            await signup(user);
        },
    });

    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const blobId = await createFile(selectedFile);
            setFile(blobId);
            console.log(file)
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <Container maxWidth="xxl" className="login-container">
            <div className="logo">
                <img src={Logo} alt="Logo" />
            </div>
            <Box className='main-box'>
                <Box
                    className="login-box"
                    sx={{
                        width: {
                            xs: '90%',
                            sm: '50%',
                            md: '40%',
                        },
                    }}
                >
                    <div className="box-content">
                        <div className="header">
                            <img src={consult} className="header-icon" alt="Consultation" />
                            <Typography variant="h4" color="initial">
                                Signup
                            </Typography>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                id="username"
                                label="Username"
                                fullWidth
                                margin="dense"
                                color="success"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                            <div style={{ position: 'relative' }}>
                                <TextField
                                    id="password"
                                    label="Password"
                                    type={showPass ? 'text' : 'password'}
                                    fullWidth
                                    margin="dense"
                                    color="success"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                                {showPass ? (
                                    <FaEye
                                        style={{ position: 'absolute', right: 10, top: 30, cursor: 'pointer' }}
                                        onClick={() => setShowPass(!showPass)}
                                    />
                                ) : (
                                    <FaEyeSlash
                                        style={{ position: 'absolute', right: 10, top: 30, cursor: 'pointer' }}
                                        onClick={() => setShowPass(!showPass)}
                                    />
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <TextField
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type={showPass ? 'text' : 'password'}
                                    fullWidth
                                    margin="dense"
                                    color="success"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />

                                {showPass ? (
                                    <FaEye
                                        style={{ position: 'absolute', right: 10, top: 30, cursor: 'pointer' }}
                                        onClick={() => setShowPass(!showPass)}
                                    />
                                ) : (
                                    <FaEyeSlash
                                        style={{ position: 'absolute', right: 10, top: 30, cursor: 'pointer' }}
                                        onClick={() => setShowPass(!showPass)}
                                    />
                                )}
                            </div>
                            <TextField
                                id="email"
                                label="Email"
                                fullWidth
                                margin="dense"
                                color="success"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                type="file"
                                fullWidth
                                margin="dense"
                                color="success"
                                onChange={handleImageUpload}
                                id="user_image"
                            />
                            <div className="btn-container">
                                <Button
                                    type="submit"
                                    sx={{
                                        mt: 2,
                                        width: { sm: '50%', xs: '80%' },
                                        color: 'green',
                                        border: '1px solid green',
                                        fontWeight: 'bold',
                                    }}
                                    className="btn"
                                    variant="outlined"
                                    disabled={isSigningUp}
                                >
                                    {isSigningUp ? 'Loading...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                        <Box sx={{ mt: 1, textAlign: 'center' }}>
                            <Typography variant="body1" color="gray">
                                Already have an account? <Link to="/login">Click here</Link>
                            </Typography>
                        </Box>
                    </div>
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <LockIcon fontSize="small" />
                    <Typography variant="body2" color="initial">
                        Your personal messages are end-to-end encrypted
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;
