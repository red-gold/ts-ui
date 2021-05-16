import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import CircularProgress from '@material-ui/core/CircularProgress';
import red from '@material-ui/core/colors/red';
import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { log } from 'utils/log';

import { IMasterLoadingComponentProps } from './IMasterComponentProps';
import Backdrop from '@material-ui/core/Backdrop';

export function MasterLoadingComponent(props: IMasterLoadingComponentProps) {
    const { t } = useTranslation();

    const loadProgress = () => {
        const { error, timedOut, pastDelay } = props;
        if (error) {
            log.error('error', error);
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress sx={{ color: red[500] }} />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {t('masterLoading.unexpectedError')}
                    </Typography>
                </Backdrop>
            );
        } else if (timedOut) {
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress sx={{ color: red[500] }} />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {t('masterLoading.timeout')}
                    </Typography>
                </Backdrop>
            );
        } else if (pastDelay) {
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {/* {t('masterLoading.loading')} */}
                    </Typography>
                </Backdrop>
            );
        } else {
            return (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" style={{ marginLeft: '15px' }}>
                        {/* {t('masterLoading.loading')} */}
                    </Typography>
                </Backdrop>
            );
        }
    };

    return <div className="mLoading__loading">{loadProgress()}</div>;
}

export default MasterLoadingComponent;
