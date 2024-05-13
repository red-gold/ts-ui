import * as Yup from 'yup';
// material
import { FormHelperText, Stack, OutlinedInput } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SocialError } from 'core/domain/common/socialError';
import useLocales from 'hooks/useLocales';
import { FormProvider } from 'components/hook-form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export interface VerifyCodeFormProps {
    verify: (code: string) => Promise<void>;
    onSuccess: () => void;
    onError: (error: SocialError) => void;
}

export default function VerifyCodeForm({ verify, onSuccess, onError }: VerifyCodeFormProps) {
    const { t } = useLocales();
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const VerifyCodeSchema = Yup.object().shape({
        code: Yup.number().required(t('emailVerification.requiredCodeError')).min(6),
    });

    const defaultValues: any = {
        code: '',
    };

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(VerifyCodeSchema),
        defaultValues,
    });

    const {
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = methods;

    const values = watch();

    const onSubmit = async (data: { code: string }) => {
        try {
            await verify(`${data.code}`);
            onSuccess();
        } catch (error: any) {
            onError(new SocialError('verifycode', error.message));
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2} justifyContent="center">
                <Controller
                    key={'code'}
                    name={`code`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <OutlinedInput
                            {...field}
                            error={!!error}
                            autoFocus
                            placeholder="-"
                            onChange={field.onChange}
                            fullWidth
                            inputProps={{
                                className: 'field-code',
                                maxLength: 6,
                            }}
                        />
                    )}
                />
            </Stack>

            {!!errors.code && (
                <FormHelperText error={!!errors.code}>
                    {t('emailVerification.requiredCodeError')} e.g. 123456
                </FormHelperText>
            )}

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ mt: 3 }}
                disabled={!!errors.code}
            >
                {t('signup.verifyButton')}
            </LoadingButton>
        </FormProvider>
    );
}
