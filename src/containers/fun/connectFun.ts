import { ComponentType } from 'react';
import { connect } from 'react-redux';

import { IFunProps } from './IFunProps';

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

export const connectFun = (component: ComponentType<IFunProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
