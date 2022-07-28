import LanguageIcon from '@mui/icons-material/Language';
import NotificationIcon from '@mui/icons-material/Notifications';
import React, { useEffect } from 'react';
import { AntTab, AntTabs } from 'components/tab';
import { LangSettingComponent } from 'containers/langSetting';
import useLocales from 'hooks/useLocales';
import { setHeaderTitle } from 'redux/actions/globalActions';
import { useDispatch, useSelector } from 'redux/store';
import { dbFetchUserSetting, dbUpdateUserSetting } from 'redux/actions/userSettingActions';
import { userSettingSelector } from 'redux/reducers/userSetting/userSettingSelector';
import { styled } from '@mui/styles';
import { ConfigComponentType } from '../constants/configComponentType';
import NotificationSettingComponent from '../containers/notificationSetting';

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

    const updateUserSetting = (type: string, setting: object) => dispatch<any>(dbUpdateUserSetting(type, setting));

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedItem(newValue);
    };

    useEffect(() => {
        dispatch<any>(setHeaderTitle(t('header.account')));
        dispatch<any>(dbFetchUserSetting());
    }, []);

    return (
        <RootStyle>
            <AntTabs value={selectedItem} onChange={handleChange} aria-label="ant example">
                <AntTab icon={<NotificationIcon />} label={t('config.notificationTab')} />
                <AntTab icon={<LanguageIcon />} label={t('config.languageTab')} />
            </AntTabs>
            <div style={{ height: 30 }} />
            {selectedItem === ConfigComponentType.Notification ? (
                <NotificationSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            ) : (
                <LangSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            )}
        </RootStyle>
    );
}
