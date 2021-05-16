
import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { companyStyles } from './companyStyles';
import { connectCompany } from './connectCompany';
import { ICompanyProps } from './ICompanyProps';
import { ICompanyState } from './ICompanyState';

export class CompanyComponent extends Component<ICompanyProps & WithTranslation, ICompanyState> {
    /**
     * Fields
     */
    iframeRef: React.RefObject<HTMLIFrameElement>;

    constructor(props: ICompanyProps & WithTranslation) {
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
const translateWrapper = withTranslation('translations')(CompanyComponent);
export default connectCompany(withStyles(companyStyles as any)(translateWrapper as any) as any);
