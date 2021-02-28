import { ComponentType } from 'react';
import { connect } from 'react-redux';

import { ICompanyProps } from './ICompanyProps';

// - Import actions
/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};

const makeMapStateToProps = () => {
    const mapStateToProps = () => {
        return {};
    };
    return mapStateToProps;
};

export const connectCompany = (component: ComponentType<ICompanyProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
