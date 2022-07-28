// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import TextField, { TextFieldProps } from '@mui/material/TextField/TextField';
import { IDatePickerProps } from './IDatePickerProps';

export default function DatePicker(props: IDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
                label={props.placeholder}
                value={props.selectedDate}
                onChange={props.dateChange}
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField fullWidth={props.fullWidth} {...params} margin="normal" />}
            />
        </LocalizationProvider>
    );
}
