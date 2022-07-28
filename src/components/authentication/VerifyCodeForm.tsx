import React from 'react';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { TextField, FormHelperText, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SocialError } from 'core/domain/common/socialError';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

// eslint-disable-next-line consistent-return
function maxLength(object: any) {
    if (object.target.value.length > object.target.maxLength) {
        return (object.target.value = object.target.value.slice(0, object.target.maxLength));
    }
}

export interface VerifyCodeFormProps {
    verify: (code: string) => Promise<void>;
    onSuccess: () => void;
    onError: (error: SocialError) => void;
}

export default function VerifyCodeForm({ verify, onSuccess, onError }: VerifyCodeFormProps) {
    const { t } = useLocales();
    const VerifyCodeSchema = Yup.object().shape({
        code: Yup.number().required(t('emailVerification.requiredCodeError')),
    });

    const formik = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: VerifyCodeSchema,
        onSubmit: async (values) => {
            try {
                await verify(`${values.code}`);
                onSuccess();
            } catch (error: any) {
                onError(error);
            }
        },
    });

    const { errors, isValid, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <TextField
                        {...getFieldProps('code')}
                        type="number"
                        onInput={maxLength}
                        error={Boolean(touched.code && errors.code)}
                        label={t('signup.codeLabel')}
                        fullWidth
                    />
                </Stack>

                <FormHelperText error={!isValid}>{!isValid && t('emailVerification.requiredCodeError')}</FormHelperText>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{ mt: 3 }}
                >
                    {t('signup.verifyButton')}
                </LoadingButton>
            </Form>
        </FormikProvider>
    );
}
