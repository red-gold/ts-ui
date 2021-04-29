import React, { Component } from 'react';
import classNames from 'classnames';
import { WithTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import List from '@material-ui/core/List';
import Popover from '@material-ui/core/Popover';
import NotifyItem from 'components/notifyItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import 'simplebar/dist/simplebar.min.css';

import { INotifyProps } from './INotifyProps';
import { INotifyState } from './INotifyState';

import CommonAPI from 'api/CommonAPI';
import { connectNotify } from './connectNotify';

export class NotifyComponent extends Component<INotifyProps & WithTranslation, INotifyState> {
    /**
     * Component constructor
     *
     */
    constructor(props: INotifyProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    notifyItemList = () => {
        const { onClose, seenNotify, deleteNotify, goTo } = this.props;
        const notifications = this.props.notifications;
        const parsedDOM: any[] = [];
        if (notifications) {
            const sortedNotifications = CommonAPI.sortImmutableV2(notifications.toList());

            sortedNotifications.forEach((notification) => {
                const notifierUserId = notification.get('ownerUserId');
                parsedDOM.push(
                    <NotifyItem
                        key={notification.get('objectId')}
                        description={notification.get('description', '')}
                        fullName={notification.get('ownerDisplayName', '')}
                        avatar={notification.get('ownerAvatar', '')}
                        id={notification.get('objectId')}
                        isSeen={notification.get('isSeen', false)}
                        url={notification.get('url')}
                        notifierUserId={notifierUserId}
                        closeNotify={onClose}
                        seenNotify={seenNotify}
                        deleteNotify={deleteNotify}
                        goTo={goTo}
                    />,
                );
            });
        }
        return parsedDOM;
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { open, anchorEl, onClose, classes, t } = this.props;
        const noNotify = <div className={classes.noNotify}>{t('header.notification.emptyCaption')} </div>;
        const items = this.notifyItemList();
        return (
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                PaperProps={{ className: classNames(classes.paper) }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                elevation={4}
            >
                <div className={classes.container}>
                    <div className={classes.header}>
                        <div className={classes.haederContent}>
                            <Typography variant="subtitle1" color="inherit" className={classes.title}>
                                {t('header.notificationTitle')}
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    <div className={classes.listRoot}>
                        <div className={classes.listWrapper}>
                            <SimpleBar style={{ maxHeight: 300 }}>
                                {items.length > 0 ? <List className={classes.list}>{items}</List> : noNotify}
                            </SimpleBar>
                        </div>
                    </div>
                </div>
            </Popover>
        );
    }
}

export default connectNotify(NotifyComponent);
