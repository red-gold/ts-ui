// - Import react components
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { userAvatarStyles } from 'components/userAvatar/userAvatarStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IUserAvatarComponentProps } from './IUserAvatarComponentProps';
import { IUserAvatarComponentState } from './IUserAvatarComponentState';

// - Import app components

// - Import API

// - Import actions
/**
 * Create component class
 */
export class UserAvatarComponent extends Component<IUserAvatarComponentProps, IUserAvatarComponentState> {
    static propTypes = {
        /**
         * Use for getting url address from server
         */
        fileName: PropTypes.string,
        /**
         * User full name
         */
        fullName: PropTypes.string,
        /**
         * Avatar style
         */
        style: PropTypes.object,
        /**
         * Avatar size
         */
        size: PropTypes.number,
        /**
         * Trigger on touch tap
         */
        onClick: PropTypes.func,
    };

    /**
     * Component constructor
     *
     */
    constructor(props: IUserAvatarComponentProps) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { fileName, fullName, style, size, onClick, className, theme } = this.props;

        return (
            <div style={{ display: 'inherit' }}>
                {fileName && fileName !== '' && fileName !== 'noImage' ? (
                    <Avatar
                        variant="rounded"
                        className={className || ''}
                        src={fileName ? fileName : ' '}
                        style={{
                            ...style,
                            backgroundColor: theme.palette.common.white,
                            width: size || 36,
                            height: size || 36,
                        }}
                        onClick={onClick}
                    />
                ) : (
                    <Avatar
                        variant="rounded"
                        className={className || ''}
                        style={{ ...style, width: size || 36, height: size || 36 }}
                        onClick={onClick}
                    >
                        {fullName ? fullName.slice(0, 1) : ''}
                    </Avatar>
                )}
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};

/**
 * Map state to props
 */
const mapStateToProps = (state: any) => {
    return {
        avatarURL: state.getIn(['imageGallery', 'imageURLList']),
        imageRequests: state.getIn(['imageGallery', 'imageRequests']),
    };
};

// - Connect component to redux store
const styleWrappedComponent = withStyles(userAvatarStyles, { withTheme: true })(UserAvatarComponent as any) as any;
export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(styleWrappedComponent);
