// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface IDatePickerProps {
    placeholder: string;
    selectedDate: Date | null;
    dateChange: (date: any, value?: string | null | undefined) => void;
    fullWidth?: boolean | undefined;
}
