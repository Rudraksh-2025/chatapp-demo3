import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '../../assets/Whispr.png';
import Grid from '@mui/material/Grid2';
import './login.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Input } from "@mui/material";
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [age, setAge] = useState(0)
    const navigate = useNavigate();
    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            login: username,
            email: email,
            password: password,
            full_name: fullName,
            age_over16: age > 16
        };
        await signup(user);
    };

    return (
        <>
            <Container maxWidth="xxl" className="login-container">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
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
                                Signup
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
                                required
                                type="password"
                                fullWidth
                                margin="dense"
                                color="success"
                                id="outlined-password"
                                label="Password"
                                variant="outlined"
                            />
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid size={6}>
                                    <TextField
                                        onChange={(e) => setFullName(e.target.value)}
                                        type="text"
                                        fullWidth
                                        margin="dense"
                                        color="success"
                                        id="full_name"
                                        label="Full Name"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        onChange={(e) => setAge(e.target.value)}
                                        type="text"
                                        fullWidth
                                        margin="dense"
                                        color="success"
                                        id="age"
                                        label="Age"
                                        variant="outlined"
                                    />
                                </Grid>

                            </Grid>




                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                required
                                fullWidth
                                margin="dense"
                                color="success"
                                id="email"
                                label="Email"
                                variant="outlined"

                            />
                            <TextField

                                onChange={(e) => setFile(e.target.files[0])}
                                type="file"
                                fullWidth
                                margin="dense"
                                color="success"
                                id="user_image"
                            />
                            <div className='btn-container'>
                                <Button
                                    onClick={handleSubmit}
                                    sx={{
                                        mt: 2,
                                        width: '50%',
                                        color: 'green',
                                        border: '1px solid green',
                                        fontWeight: 'bold'
                                    }}
                                    className="btn"
                                    variant="outlined"
                                >
                                    {isSigningUp ? ("Loading...") : ("Create Account")}
                                </Button>
                            </div>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body1" color="gray">Already have and account??
                                    <Link to='/login'>Click here</Link></Typography>
                            </Box>

                        </div>
                    </div>
                </Box>
            </Container>
        </>
    );
};

export default Signup;
