// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React from 'react';
import AdapterMoment from '@material-ui/lab/AdapterMoment';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import { IDatePickerProps } from './IDatePickerProps';
import TextField from '@material-ui/core/TextField/TextField';

export default function DatePicker(props: IDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <MobileDatePicker
                label={props.placeholder}
                value={props.selectedDate}
                onChange={props.dateChange}
                renderInput={(params) => <TextField fullWidth={props.fullWidth} {...params} margin="normal" />}
            />
        </LocalizationProvider>
    );
}
