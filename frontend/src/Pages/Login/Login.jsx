import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '../../assets/Whispr.png';
import './login.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <>
            <Container maxWidth="xxl" className="login-container">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', width: "100%" }}>
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
                                <Typography variant="h4" color="initial">
                                    Login
                                </Typography>
                            </div>
                            <div className="content">
                                <TextField
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    fullWidth
                                    margin="normal"
                                    color="success"
                                    id="outlined-username"
                                    label="Username"
                                    variant="outlined"
                                />
                                <TextField
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    required
                                    fullWidth
                                    margin="normal"
                                    color="success"
                                    id="outlined-password"
                                    label="Password"
                                    variant="outlined"
                                />
                                <div className='btn-container'><Button
                                    onClick={handleSubmit}
                                    disabled={isLoggingIn}
                                    sx={{
                                        my: 2,
                                        width: '50%',
                                        color: 'green',
                                        border: '1px solid green',
                                        fontWeight: 'bold'
                                    }}
                                    className="btn"
                                    variant="outlined"
                                >
                                    {isLoggingIn ? 'Logging in...' : 'Login'}
                                </Button></div>

                            </div>
                        </div>
                    </Box>
                    <Box>
                        <Typography variant="body" color="initial">
                            Your personal messages are end to end encrypted
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
