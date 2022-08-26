import React from 'react';
// material
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingScreen({ ...other }) {
    return (
        <Backdrop {...other} open>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
