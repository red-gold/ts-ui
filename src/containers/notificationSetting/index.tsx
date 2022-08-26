import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { Map } from 'immutable';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { UserSettingEnum } from 'constants/userSettingEnum';
import { INotificationSettingProps } from './INotificationSettingProps';
import { useStyles } from './notificationSettingStyles';

export function NotificationSettingComponent(props: INotificationSettingProps & WithTranslation) {
    const [checked, setChecked] = React.useState(props.userSettings.get('notification', Map({})));
    const classes = useStyles();

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

    const { t } = props;

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
export default translateWrapper;
