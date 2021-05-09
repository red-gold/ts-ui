import LanguageIcon from '@material-ui/icons/Language';
import NotificationIcon from '@material-ui/icons/Notifications';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import NotificationSettingComponent from '../notificationSetting';
import { ConfigComponentType } from './configComponentType';
import { IConfigProps } from './IConfigProps';
import { IConfigState } from './IConfigState';
import { AntTab, AntTabs } from 'components/tab';
import { connectConfig } from './connectConfig';

export class ConfigComponent extends Component<IConfigProps & WithTranslation, IConfigState> {
    /**
     * Component constructor
     */
    constructor(props: IConfigProps & WithTranslation) {
        super(props);
        this.state = {
            selectedItem: ConfigComponentType.Notification,
            selectedText: '',
            mobileOpen: false,
        };
    }

    handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        this.setState({
            selectedItem: newValue,
        });
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    componentDidMount() {
        const { getUserSetting } = this.props;
        if (getUserSetting) {
            getUserSetting();
        }
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t, updateUserSetting, userSetting } = this.props;

        const { selectedItem } = this.state;

        return (
            <div className={classes.root}>
                <AntTabs value={selectedItem} onChange={this.handleChange} aria-label="ant example">
                    <AntTab icon={<NotificationIcon />} label={t('config.notificationTab')} />
                    <AntTab icon={<LanguageIcon />} label={t('config.languageTab')} />
                </AntTabs>
                <div style={{ height: 30 }}></div>
                {selectedItem === ConfigComponentType.Notification ? (
                    <NotificationSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}

export default withRouter(connectConfig(ConfigComponent));
