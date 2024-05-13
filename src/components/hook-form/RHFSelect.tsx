// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import React from 'react';

interface RHFSelectProps {
    children?: React.ReactNode;
    name?: string;
}

export default function RHFSelect({ name, children, ...other }: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name || ''}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    error={!!error}
                    helperText={error?.message}
                    {...other}
                >
                    {children}
                </TextField>
            )}
        />
    );
}
