// - Import external components
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { notificationSettingStyles } from 'containers/notificationSetting/notificationSettingStyles';
import { Map } from 'immutable';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { INotificationSettingProps } from './INotificationSettingProps';
import { UserSettingEnum } from 'constants/userSettingEnum';

export function NotificationSettingComponent(props: INotificationSettingProps & WithTranslation) {
    const [checked, setChecked] = React.useState(props.userSettings.get('notification', Map({})));

    /**
     * Handle check toggle
     */
    const handleToggle = (value: any) => () => {
        const isChecked = checked.getIn([value, 'value'], 'false');

        if (isChecked == 'true') {
            setChecked(checked.setIn([value, 'value'], 'false'));
        } else {
            setChecked(checked.setIn([value, 'value'], 'true'));
        }
    };

    /**
     * Handle save changes
     */
    const handleSaveChanges = () => {
        const { updateUserSetting } = props;
        if (updateUserSetting) {
            updateUserSetting('notification', checked);
        }
    };

    const { classes, t } = props;

    return (
        <Paper className={classes.root}>
            <List subheader={<ListSubheader>{t('config.notificationActivity')}</ListSubheader>}>
                <ListItem>
                    <ListItemIcon>
                        <Switch
                            onChange={handleToggle(UserSettingEnum.send_email_on_like)}
                            checked={checked.getIn([UserSettingEnum.send_email_on_like, 'value'], 'false') === 'true'}
                        />
                    </ListItemIcon>
                    <ListItemText primary={t('config.notification.emailOnVote')} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Switch
                            onChange={handleToggle(UserSettingEnum.send_email_on_follow)}
                            checked={checked.getIn([UserSettingEnum.send_email_on_follow, 'value'], 'false') === 'true'}
                        />
                    </ListItemIcon>
                    <ListItemText primary={t('config.notification.emailOnFollow')} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Switch
                            onChange={handleToggle(UserSettingEnum.send_email_on_comment_post)}
                            checked={
                                checked.getIn([UserSettingEnum.send_email_on_comment_post, 'value'], 'false') === 'true'
                            }
                        />
                    </ListItemIcon>
                    <ListItemText primary={t('config.notification.emailOnComment')} />
                </ListItem>
            </List>
            <CardActions className={classes.cardActions}>
                <Button color="primary" onClick={handleSaveChanges}>
                    {t('config.saveChangesButton')}{' '}
                </Button>
            </CardActions>
        </Paper>
    );
}

const translateWrapper = withTranslation('translations')(NotificationSettingComponent);
export default withStyles(notificationSettingStyles)(translateWrapper);
