import LanguageIcon from '@material-ui/icons/Language';
import NotificationIcon from '@material-ui/icons/Notifications';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import NotificationSettingComponent from '../notificationSetting';
import { ConfigComponentType } from './configComponentType';
import { IConfigProps } from './IConfigProps';
import { IConfigState } from './IConfigState';
import { AntTab, AntTabs } from 'components/tab';
import { connectConfig } from './connectConfig';
import { LangSettingComponent } from 'containers/langSetting';

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
        const { getUserSetting, setHeaderTitle, t } = this.props;
        setHeaderTitle(t('header.settings'));
        getUserSetting();
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
                    <LangSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
                )}
            </div>
        );
    }
}

export default connectConfig(ConfigComponent);
