import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import Master from 'containers/master';
import HomeComponent from 'containers/home';
import ErrorBoundary from 'ErrorBoundary';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
});

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    return (
        <RootStyle>
            <Master>
                <ErrorBoundary>
                    <HomeComponent>
                        <Outlet />
                    </HomeComponent>
                </ErrorBoundary>
            </Master>
        </RootStyle>
    );
}
