// - Import react components
import React, { Component, Fragment } from 'react';
import SvgCamera from '@material-ui/icons/PhotoCamera';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { WithTranslation } from 'react-i18next';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import { IPostWriteButtonProps } from './IPostWriteButtonProps';
import { IPostWriteButtonState } from './IPostWriteButtonState';
import { connectPostWriteButton } from './connectPostWriteButton';

/**
 * Create component class
 */
export class PostWriteButton extends Component<IPostWriteButtonProps & WithTranslation, IPostWriteButtonState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IPostWriteButtonProps & WithTranslation) {
        super(props);

        this.handleOpenPostWrite = this.handleOpenPostWrite.bind(this);
    }

    /**
     * Open post write
     */
    handleOpenPostWrite = () => {
        const { openPostWrite } = this.props;
        if (openPostWrite) {
            openPostWrite();
        }
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { tag, displayWriting, classes, t } = this.props;
        return (
            <div className={classNames('grid-cell animate-top', classes.gridCell)}>
                {displayWriting && !tag ? (
                    <>
                        <Paper elevation={2}>
                            <ListItem button className={classes.postWtireItem} onClick={this.handleOpenPostWrite}>
                                <UserAvatarComponent
                                    fullName={this.props.fullName}
                                    fileName={this.props.avatar}
                                    size={36}
                                />
                                <ListItemText
                                    inset
                                    primary={
                                        <span className={classes.postWritePrimaryText}>
                                            {' '}
                                            {t('home.postWriteButtonText')}
                                        </span>
                                    }
                                />
                                <ListItemIcon>
                                    <SvgCamera />
                                </ListItemIcon>
                            </ListItem>
                        </Paper>
                        <div style={{ height: '16px' }}></div>
                    </>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default connectPostWriteButton(PostWriteButton);
