import { ComponentType } from 'react';
import { connect } from 'react-redux';

import { IHelpProps } from './IHelpProps';

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

export const connectHelp = (component: ComponentType<IHelpProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
