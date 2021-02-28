// - Import external components
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { notificationSettingStyles } from 'containers/notificationSetting/notificationSettingStyles';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as userSettingActions from 'store/actions/userSettingActions';

import { INotificationSettingProps } from './INotificationSettingProps';
import { INotificationSettingState } from './INotificationSettingState';
import { userSettingSelector } from 'store/reducers/userSetting/userSettingSelector';
import { UserSettingEnum } from 'constants/userSettingEnum';

/**
 * Material-UI
 */
// - Components
// - Import actions
/**
 * Create component class
 */
export class NotificationSettingComponent extends Component<
    INotificationSettingProps & WithTranslation,
    INotificationSettingState
> {
    static getDerivedStateFromProps(props: INotificationSettingProps, state: INotificationSettingState) {
        if (!state.initialiazed && props.notificationSetting.count() > 0) {
            return {
                initialiazed: true,
                checked: props.notificationSetting,
            };
        }

        // Return null to indicate no change to state.
        return null;
    }

    /**
     * Component constructor
     */
    constructor(props: INotificationSettingProps & WithTranslation) {
        super(props);

        this.state = {
            checked: Map([]),
            initialiazed: false,
        };
        // Binding function to `this`
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
    }

    /**
     * Handle check toggle
     */
    handleToggle = (value: any) => () => {
        let { checked } = this.state;
        const isChecked = checked.getIn([value, 'value'], 'false');

        if (isChecked == 'true') {
            checked = checked.setIn([value, 'value'], 'false');
        } else {
            checked = checked.setIn([value, 'value'], 'true');
        }

        this.setState({
            checked: checked,
        });
    };

    /**
     * Handle save changes
     */
    handleSaveChanges() {
        const { checked } = this.state;
        const { updateUserSetting } = this.props;
        if (updateUserSetting) {
            updateUserSetting('notification', checked);
        }
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t } = this.props;
        const { checked } = this.state;
        if (!t) {
            return <div />;
        }
        return (
            <Grid container spacing={2} className={classes.notification}>
                <Grid item sm={12} xs={12} md={3} lg={4} xl={4} className={classes.headerCaption}>
                    <Typography variant="h6"> {t('config.notificationLabel')} </Typography>

                    <Typography variant="caption"> {t('config.notificationCaption')} </Typography>
                </Grid>
                <Grid item sm={12} xs={12} md={9} lg={8} xl={8}>
                    <div className="animate-bottom">
                        <Paper className={classes.root}>
                            <List subheader={<ListSubheader>{t('config.notificationLabel')}</ListSubheader>}>
                                <ListItem>
                                    <ListItemText primary={t('config.notification.emailOnVote')} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            onChange={this.handleToggle(UserSettingEnum.send_email_on_like)}
                                            checked={
                                                checked.getIn(
                                                    [UserSettingEnum.send_email_on_like, 'value'],
                                                    'false',
                                                ) === 'true'
                                            }
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={t('config.notification.emailOnFollow')} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            onChange={this.handleToggle(UserSettingEnum.send_email_on_follow)}
                                            checked={
                                                checked.getIn(
                                                    [UserSettingEnum.send_email_on_follow, 'value'],
                                                    'false',
                                                ) === 'true'
                                            }
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={t('config.notification.emailOnComment')} />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            onChange={this.handleToggle(UserSettingEnum.send_email_on_comment_post)}
                                            checked={
                                                checked.getIn(
                                                    [UserSettingEnum.send_email_on_comment_post, 'value'],
                                                    'false',
                                                ) === 'true'
                                            }
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                            <CardActions>
                                <Button color="primary" onClick={this.handleSaveChanges}>
                                    {t('config.saveChangesButton')}{' '}
                                </Button>
                            </CardActions>
                        </Paper>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        updateUserSetting: (type: string, setting: object) =>
            dispatch(userSettingActions.dbUpdateUserSetting(type, setting)),
    };
};

const makeMapStateToProps = () => {
    const selectNotificationSetting = userSettingSelector.selectUserSetting();

    const mapStateToProps = (state: Map<string, any>) => {
        const notificationSetting = selectNotificationSetting(state).get('notification', Map({}));
        return {
            notificationSetting,
        };
    };
    return mapStateToProps;
};

// - Connect component to redux storea
const translateWrapper = withTranslation('translations')(NotificationSettingComponent);
export default withRouter<any, any>(
    connect<any>(
        makeMapStateToProps as any,
        mapDispatchToProps,
    )(withStyles(notificationSettingStyles as any)(translateWrapper as any)),
);
