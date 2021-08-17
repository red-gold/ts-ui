import React from 'react';
// material
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingScreen({ ...other }) {
    return (
        <Backdrop {...other} open>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
