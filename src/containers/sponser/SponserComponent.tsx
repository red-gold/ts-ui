import { withStyles } from '@mui/styles';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { connectSponser } from './connectSponser';
import { ISponserProps } from './ISponserProps';
import { ISponserState } from './ISponserState';
import { sponserStyles } from './sponserStyles';

export class SponserComponent extends Component<ISponserProps & WithTranslation, ISponserState> {
  
    constructor(props: ISponserProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return <div className={classes.root} />;
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SponserComponent);

export default connectSponser(withStyles(sponserStyles as any)(translateWrapper as any) as any);
