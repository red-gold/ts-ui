// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { IDatePickerProps } from './IDatePickerProps';

export default function DatePicker(props: IDatePickerProps) {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label={props.placeholder}
                format="MM/dd/yyyy"
                value={props.selectedDate}
                onChange={props.dateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                fullWidth={props.fullWidth}
            />
        </MuiPickersUtilsProvider>
    );
}
