// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button/Button';
import { INavItemProps } from './INavItemProps';

function NavItem(props: INavItemProps) {
    const { href, icon: Icon, title } = props;
    const location = useLocation();

    const active = href
        ? !!matchPath(
              {
                  path: href,
                  end: false,
              },
              location.pathname,
          )
        : false;

    return (
        <ListItem
            disableGutters
            sx={{
                display: 'flex',
                py: 0,
            }}
        >
            <Button
                component={RouterLink}
                sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    justifyContent: 'flex-start',
                    letterSpacing: 0,
                    py: 1.25,
                    textTransform: 'none',
                    width: '100%',
                    ...(active && {
                        color: 'primary.main',
                    }),
                    '& svg': {
                        mr: 1,
                    },
                }}
                to={href}
            >
                {Icon && <Icon size="20" />}
                <span>{title}</span>
            </Button>
        </ListItem>
    );
}

export default NavItem;
