import About from 'components/about';
import React from 'react';
import { IProfileRightPanelProps } from './IProfileRightPanelProps';

export function ProfileRightPanel(props: IProfileRightPanelProps) {
    return (
        <>
            <div style={{ height: 24 }} />
            <About isCurrentUser={props.isCurrentUser} profile={props.profile} />
        </>
    );
}

export default ProfileRightPanel;
