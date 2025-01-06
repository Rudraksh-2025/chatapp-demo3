import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '../../assets/Whisper.png';
import './login.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import consultation2 from '../../assets/consultation2.gif';
import { Link } from 'react-router-dom'

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
                <Box className='main-box'
                >
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
                                <img src={consultation2} className="header-icon" />
                                <Typography variant="h4" color="initial">
                                    Login
                                </Typography>
                            </div>
                            <div className="content">
                                <TextField
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    fullWidth
                                    size='medium'
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
                                    size='medium'
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
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1" color="gray">Don't have Account?
                                        <Link to='/signup' > Click here</Link></Typography>
                                </Box>

                            </div>
                        </div>
                    </Box>
                    <Box sx={{
                        alignItems: 'center',
                        gap: 1,
                        display: { xs: 'none', sm: 'flex' }
                    }}>
                        <LockIcon fontSize='small' />
                        <Typography variant="body2" color="initial">
                            Your personal messages are end to end encrypted
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
