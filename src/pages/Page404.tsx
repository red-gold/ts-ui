import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { experimentalStyled as styled } from '@mui/material/styles';

const HomeButtonRoot = styled('div')({
    textAlign: 'center',
});
const NotFound = () => {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>{t('notFound.header', { appName: config.settings.appName })}</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography sx={{ fontSize: '2rem' }} align="center" color="textPrimary" variant="h1">
                        {t('notFound.title')}
                    </Typography>
                    <Typography align="center" color="textPrimary" variant="subtitle2">
                        {t('notFound.description')}
                    </Typography>
                    <HomeButtonRoot>
                        <Button href="/">{t('notFound.homeButton')}</Button>
                    </HomeButtonRoot>
                    <Box sx={{ textAlign: 'center' }}>
                        <img
                            alt="Under development"
                            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                            style={{
                                display: 'inline-block',
                                maxWidth: '100%',
                                width: 560,
                            }}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    );
};
export default NotFound;
