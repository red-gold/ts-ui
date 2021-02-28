import { ComponentType } from 'react';
import { connect } from 'react-redux';

import { ISponserProps } from './ISponserProps';

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

export const connectSponser = (component: ComponentType<ISponserProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
