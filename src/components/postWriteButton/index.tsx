import React, { Component, Fragment } from 'react';
import SvgCamera from '@mui/icons-material/PhotoCamera';
import classNames from 'classnames';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { WithTranslation } from 'react-i18next';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import MyAvatar from 'components/MyAvatar';
import { IPostWriteButtonProps } from './IPostWriteButtonProps';
import { IPostWriteButtonState } from './IPostWriteButtonState';
import { connectPostWriteButton } from './connectPostWriteButton';

export class PostWriteButton extends Component<IPostWriteButtonProps & WithTranslation, IPostWriteButtonState> {
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

    render() {
        const { tag, displayWriting, classes, t } = this.props;
        return (
            <div className={classNames('grid-cell animate-top', classes.gridCell)}>
                {displayWriting && !tag ? (
                    <>
                        <Paper elevation={2}>
                            <ListItem button className={classes.postWtireItem} onClick={this.handleOpenPostWrite}>
                                <MyAvatar size={36} />
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
                        <div style={{ height: '16px' }} />
                    </>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default connectPostWriteButton(PostWriteButton);
