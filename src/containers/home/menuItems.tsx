import ProfileIcon from '@material-ui/icons/AssignmentIndRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import HelpIcon from '@material-ui/icons/HelpRounded';

export const menuItems = (userId: string, translate: (key: string) => string) => [
    {
        label: translate('sidebar.home'),
        path: '/',
        icon: HomeIcon,
    },
    {
        label: translate('sidebar.profile'),
        path: `/${userId}`,
        icon: ProfileIcon,
    },
    {
        label: translate('sidebar.people'),
        path: `/people`,
        icon: PeopleIcon,
    },
    {
        divider: true,
    },
    {
        label: translate('sidebar.settings'),
        path: `/settings`,
        icon: SettingsIcon,
    },
    {
        label: translate('sidebar.support'),
        path: `/support`,
        icon: HelpIcon,
    },
];
