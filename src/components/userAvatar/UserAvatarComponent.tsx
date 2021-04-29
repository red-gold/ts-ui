// - Import react components
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import React, { Component } from 'react';
import { userAvatarStyles } from './userAvatarStyles';
import { connect } from 'react-redux';

import { IUserAvatarProps } from './IUserAvatarProps';
import { IUserAvatarState } from './IUserAvatarState';

export class UserAvatarComponent extends Component<IUserAvatarProps, IUserAvatarState> {
    constructor(props: IUserAvatarProps) {
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

const styleWrappedComponent = withStyles(userAvatarStyles, { withTheme: true })(UserAvatarComponent);
export default styleWrappedComponent;
