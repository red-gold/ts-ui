import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import red from '@mui/material/colors/red';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { log } from 'utils/log';

import Backdrop from '@mui/material/Backdrop';
import { IMasterLoadingComponentProps } from './IMasterComponentProps';

export function MasterLoadingComponent(props: IMasterLoadingComponentProps) {
    const { t } = useTranslation();

    const loadProgress = () => {
        const { error, timedOut, pastDelay } = props;
        if (error) {
            log.error('error', error);
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress sx={{ color: red[500] }} />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {t('masterLoading.unexpectedError')}
                    </Typography>
                </Backdrop>
            );
        } if (timedOut) {
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress sx={{ color: red[500] }} />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {t('masterLoading.timeout')}
                    </Typography>
                </Backdrop>
            );
        } if (pastDelay) {
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {/* {t('masterLoading.loading')} */}
                    </Typography>
                </Backdrop>
            );
        } 
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {/* {t('masterLoading.loading')} */}
                    </Typography>
                </Backdrop>
            );
        
    };

    return <div className="mLoading__loading">{loadProgress()}</div>;
}

export default MasterLoadingComponent;
