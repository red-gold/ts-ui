import LanguageIcon from '@material-ui/icons/Language';
import NotificationIcon from '@material-ui/icons/Notifications';
import React, { useEffect } from 'react';
import NotificationSettingComponent from '../containers/notificationSetting';
import { ConfigComponentType } from '../constants/configComponentType';
import { AntTab, AntTabs } from 'components/tab';
import { LangSettingComponent } from 'containers/langSetting';
import useLocales from 'hooks/useLocales';
import { setHeaderTitle } from 'redux/actions/globalActions';
import { useDispatch, useSelector } from 'redux/store';
import { dbFetchUserSetting, dbUpdateUserSetting } from 'redux/actions/userSettingActions';
import { userSettingSelector } from 'redux/reducers/userSetting/userSettingSelector';
import { styled } from '@material-ui/styles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    paddingLeft: 24,
    paddingRight: 24,
}));

// ----------------------------------------------------------------------

// selectors
const selectUserSetting = userSettingSelector.selectUserSetting();

export default function AccountPage() {
    const { t } = useLocales();
    const dispatch = useDispatch();

    const [selectedItem, setSelectedItem] = React.useState(ConfigComponentType.Notification);

    const userSetting = useSelector(selectUserSetting);

    const updateUserSetting = (type: string, setting: object) => dispatch(dbUpdateUserSetting(type, setting));

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedItem(newValue);
    };

    useEffect(() => {
        dispatch(setHeaderTitle(t('header.account')));
        dispatch(dbFetchUserSetting());
    }, []);

    return (
        <RootStyle>
            <AntTabs value={selectedItem} onChange={handleChange} aria-label="ant example">
                <AntTab icon={<NotificationIcon />} label={t('config.notificationTab')} />
                <AntTab icon={<LanguageIcon />} label={t('config.languageTab')} />
            </AntTabs>
            <div style={{ height: 30 }}></div>
            {selectedItem === ConfigComponentType.Notification ? (
                <NotificationSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            ) : (
                <LangSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            )}
        </RootStyle>
    );
}
