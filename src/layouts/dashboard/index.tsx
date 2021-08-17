import React from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
//
import Master from 'containers/master';
import HomeComponent from 'containers/home';

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
                <HomeComponent>
                    <Outlet />
                </HomeComponent>
            </Master>
        </RootStyle>
    );
}
