import ProfileIcon from '@mui/icons-material/AssignmentIndRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import HelpIcon from '@mui/icons-material/HelpRounded';
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
