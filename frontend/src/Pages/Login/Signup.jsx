import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '../../assets/Whisper.png';
import Grid from '@mui/material/Grid2';
import './login.css';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthStore } from '../../store/useAuthStore';
import LockIcon from '@mui/icons-material/Lock';
import consult from '../../assets/consult.gif';
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
            blob_id: file,
            age_over16: age > 16
        };
        await signup(user);
    };


    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const blobId = await useAuthStore.getState().uploadFile(selectedFile);
            setFile(blobId);
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <>
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
                                <div className="header">
                                    <img src={consult} className="header-icon" />
                                    <Typography variant="h4" color="initial">
                                        Signup
                                    </Typography>
                                </div>
                            </div>
                            <div className="content">

                                <TextField
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    fullWidth
                                    size="medium"
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
                                    size="medium"
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
                                            size="medium"
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
                                            size="medium"
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
                                    size="medium"
                                    color="success"
                                    id="email"
                                    label="Email"
                                    variant="outlined"

                                />
                                <TextField
                                    type="file"
                                    fullWidth
                                    margin="dense"
                                    color="success"
                                    onChange={handleImageUpload}
                                    id="user_image"
                                />
                                <div className='btn-container'>
                                    <Button
                                        onClick={handleSubmit}
                                        sx={{
                                            mt: 2,
                                            width: { sm: '50%', xs: '80%' },
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

                                <Box sx={{ mt: 1, textAlign: 'center' }}>
                                    {/* <Typography variant="body1" color="gray">Already have an account ?
                                        <Link to='/login' underline="always"> Click here</Link></Typography> */}
                                </Box>

                            </div>
                        </div>
                    </Box>
                    <Box sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <LockIcon fontSize='small' />
                        <Typography variant="body2" color="initial">
                            Your personal messages are end to end encrypted
                        </Typography>
                    </Box>
                </Box>
            </Container >
        </>
    );
};

export default Signup;
