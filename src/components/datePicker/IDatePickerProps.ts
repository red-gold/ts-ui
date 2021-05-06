// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

export interface IDatePickerProps {
    placeholder: string;
    selectedDate: Date | null;
    dateChange: (date: MaterialUiPickersDate, value?: string | null | undefined) => void;
}
