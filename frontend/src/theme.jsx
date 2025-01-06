import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: '"Montserrat", sans-serif',
        // Main variants
        h1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
        },
        h3: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
        },
        h4: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 500,
        },
        h6: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 500,
        },
        // Body variants
        body1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
        },
        body2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
        },
        button: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            textTransform: 'none', // Prevents automatic uppercase transformation
        },
        caption: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
        },
        overline: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
        },
    },
    components: {
        MuiTextField: {
            variants: [
                {
                    props: { size: 'medium' },
                    style: {
                        '& .MuiInputBase-root': {
                            height: '45px',
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '12px 14px',
                        },
                        '& .MuiInputLabel-root': {
                            transform: 'translate(14px, 13px)',
                        },
                        '& .MuiInputLabel-shrink': {
                            transform: 'translate(14px, -9px) scale(0.75)',
                        },
                    },
                },
            ],
        },
    },
    palette: {
        primary: {
            main: '#FFFFFF',
        },
        secondary: {
            main: '#f44336',
        },
    }
});

export default theme;