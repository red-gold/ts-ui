import React from 'react';
import config from 'config/index';
import ReCAPTCHA from 'react-google-recaptcha';

// ----------------------------------------------------------------------

export interface GoogleRecaptchaProps {
    onExpired: () => void;
    onSuccess: (token: string | null) => void;
    onError?: () => void;
}

export default function GoogleRecaptcha({ onExpired, onSuccess, onError }: GoogleRecaptchaProps) {
    return (
        <>
            {config.settings.recaptcha_site_key && (
                <ReCAPTCHA
                    sitekey={config.settings.recaptcha_site_key}
                    onChange={onSuccess}
                    onExpired={onExpired}
                    onErrored={onError}
                />
            )}
        </>
    );
}
