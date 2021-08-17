import ProfileIcon from '@material-ui/icons/AssignmentIndRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import HelpIcon from '@material-ui/icons/HelpRounded';
import { PATH_MAIN } from 'routes/paths';

export const menuItems = (socialName: string, translate: (key: string) => string) => [
    {
        label: translate('sidebar.home'),
        path: PATH_MAIN.user.home,
        icon: HomeIcon,
    },
    {
        label: translate('sidebar.people'),
        path: PATH_MAIN.user.friends,
        icon: PeopleIcon,
    },
    {
        label: translate('sidebar.profile'),
        path: PATH_MAIN.user.profile.replace(':socialName', socialName),
        icon: ProfileIcon,
    },
    {
        divider: true,
    },
    {
        label: translate('sidebar.account'),
        path: PATH_MAIN.user.account,
        icon: SettingsIcon,
    },
    {
        label: translate('sidebar.support'),
        path: `/support`,
        icon: HelpIcon,
    },
];
