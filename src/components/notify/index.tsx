import React from 'react';
import classNames from 'classnames';
import SimpleBar from 'simplebar-react';
import List from '@material-ui/core/List';
import Popover from '@material-ui/core/Popover';
import NotifyItem from 'components/notifyItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import 'simplebar/dist/simplebar.min.css';
import { Map } from 'immutable';
import { INotifyProps } from './INotifyProps';

import CommonAPI from 'api/CommonAPI';
import { useDispatch, useSelector } from 'react-redux';
import * as notifyActions from 'redux/actions/notifyActions';
import { notificationSelector } from 'redux/reducers/notifications/notificationSelector';
import { useTranslation } from 'react-i18next';
import { useStyles } from './notifyStyles';

const selectNotifications = notificationSelector.selectNotifications();

export function NotifyComponent(props: INotifyProps) {
    const { t } = useTranslation();
    const classes = useStyles();

    // Dispatchers
    const dispatch = useDispatch();
    const seenNotify = (id: string) => dispatch(notifyActions.dbSeenNotification(id));
    const deleteNotify = (id: string) => dispatch(notifyActions.dbDeleteNotification(id));

    // Selectors
    const notifications = useSelector((state: Map<string, any>) => selectNotifications(state));

    const notifyItemList = () => {
        const { onClose } = props;

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
                    />,
                );
            });
        }
        return parsedDOM;
    };

    const { open, anchorEl, onClose } = props;
    const noNotify = (
        <Typography variant="subtitle1" className={classes.noNotify}>
            {t('header.notification.emptyCaption')}{' '}
        </Typography>
    );
    const items = notifyItemList();
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
                    <div className={classes.headerContent}>
                        <Typography variant="subtitle1" color="inherit">
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

export default NotifyComponent;
