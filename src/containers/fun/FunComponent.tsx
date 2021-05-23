import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { connectFun } from './connectFun';
import { funStyles } from './funStyles';
import { IFunProps } from './IFunProps';
import { IFunState } from './IFunState';

export class HelpComponent extends Component<IFunProps & WithTranslation, IFunState> {
    /**
     * Fields
     */
    iframeRef: React.RefObject<HTMLIFrameElement>;

    constructor(props: IFunProps & WithTranslation) {
        super(props);
        this.iframeRef = React.createRef();

        // Defaul state
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return <div className={classes.root}></div>;
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(HelpComponent);

export default connectFun(withStyles(funStyles as any)(translateWrapper as any) as any);
