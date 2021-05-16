import React from 'react';
import Contacts from '../contacts';
import PeopleBox from '../peopleBox';

export function RightPanel() {
    return (
        <>
            <Contacts />
            <div style={{ height: 10 }} />
            <PeopleBox />
        </>
    );
}

export default RightPanel;
