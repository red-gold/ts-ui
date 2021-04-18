// - Import react components
import React, { Component } from 'react';
import { IRightPanelProps } from './IRightPanelProps';
import { IRightPanelState } from './IRightPanelState';
import Contacts from '../contacts';
import PeopleBox from '../peopleBox';

/**
 * Create component class
 */
export class RightPanel extends Component<IRightPanelProps, IRightPanelState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IRightPanelProps) {
        super(props);
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        return (
            <>
                <Contacts />
                <div style={{ height: 10 }} />
                <PeopleBox />
            </>
        );
    }
}

// export default connectRightPanel(RightPanel);
export default RightPanel;
