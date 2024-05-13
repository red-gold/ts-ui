// form

import React from 'react';
import { FormProvider as Form, UseFormReturn, FieldValues } from 'react-hook-form';

interface FormProviderProps {
    children: React.ReactNode;
    methods: UseFormReturn<FieldValues, any>;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export default function FormProvider({ children, onSubmit, methods }: FormProviderProps) {
    return (
        <Form {...methods}>
            <form onSubmit={onSubmit}>{children}</form>
        </Form>
    );
}
