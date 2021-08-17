import React from 'react';
import Footer from 'oldComponents/footer';
import { styled } from '@material-ui/core/styles';
import Logo from 'components/Logo';

// ----------------------------------------------------------------------

const AppbarStyle = styled('div')(() => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    '& > div': {
        width: '100%',
        height: '510px',
        position: 'absolute',
        left: '40%',
        opacity: 0.2,
    },
}));

const ContainerStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '1 0 auto',
    padding: '55px 0 11px 0',
    [theme.breakpoints.down('xs')]: {
        padding: '0px 0 11px 0',
    },
    '&:before': {
        position: 'absolute',
        top: '-145px',
        left: '0',
        width: '100%',
        minHeight: '365px',
        height: '60vh',
        content: '" "',
        // background: `${theme.palette.secondary.light} url(${config.settings.publicCover})`,
        // backgroundColor: '#1e4fea;',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        transition: 'background .4s',
        backgroundPositionY: 'initial',
        backgroundPositionX: 'center',
    },
}));

const CenterRootStyle = styled('div')(({ theme }) => ({
    maxWidth: 1240,
    height: 519,
    width: '100%',
    margin: '0 auto',
    padding: '0 20px',
    [theme.breakpoints.down('xs')]: {
        margin: 0,
        padding: 0,
        height: 330,
    },
}));

const CenterContainerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    margin: '0 auto',
    boxShadow: ' 0 20px 40px rgba(0,0,0,.1)',
    textAlign: 'center',
    borderRadius: 5,
    width: 435,
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
        boxShadow: 'unset',
        margin: 0,
        padding: 0,
        width: '100% !important',
        borderRadius: 0,
    },
    [theme.breakpoints.down('sm')]: {
        width: 435,
    },
}));

const PageStyle = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    [theme.breakpoints.down('xs')]: {
        margin: 0,
        padding: 0,
        width: '100%',
        backgroundColor: 'transparent',
    },
    zIndex: 1,
    minWidth: 435,
    [theme.breakpoints.down('xs')]: {
        minWidth: '100%',
    },
}));

const GapStyle = styled('div')(() => ({
    height: 60,
}));

// ----------------------------------------------------------------------

export interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    return (
        <>
            <AppbarStyle>
                <Logo />
            </AppbarStyle>
            <ContainerStyle>
                <CenterRootStyle>
                    <CenterContainerStyle>
                        <PageStyle>{children}</PageStyle>
                    </CenterContainerStyle>
                </CenterRootStyle>
                <GapStyle />
                <Footer />
            </ContainerStyle>
        </>
    );
}
