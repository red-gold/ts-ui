// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import React from 'react';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

export const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);

export const AntTab = withStyles((theme: Theme) => ({
    root: {
        textTransform: 'none',
        maxWidth: 264,
        minWidth: 72,
        position: 'relative',
        flexShrink: 0,
        'min-height': '48px !important',
        padding: '0px',
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    selected: {},
    wrapper: {
        'flex-direction': 'row !important',
        whiteSpace: 'nowrap',
        '&> *:first-of-type': {
            marginBottom: '0 !important',
            marginRight: 8,
        },
    },
}))((props: StyledTabProps & { icon?: string | React.ReactElement }) => <Tab disableRipple {...props} />);

interface StyledTabsProps {
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
    children: React.ReactNode;
}

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: '#635ee7',
        },
    },
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

interface StyledTabProps {
    label: string;
}

const StyledTab = withStyles((theme: Theme) => ({
    root: {
        textTransform: 'none',
        color: '#fff',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
    },
}))((props: StyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        padding: theme.spacing(3),
    },
    demo1: {
        backgroundColor: theme.palette.background.paper,
    },
    demo2: {
        backgroundColor: '#2e1534',
    },
}));

export default function CustomizedTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <div className={classes.demo1}>
                <AntTabs value={value} onChange={handleChange} aria-label="ant example">
                    <AntTab label="Tab 1" />
                    <AntTab label="Tab 2" />
                    <AntTab label="Tab 3" />
                </AntTabs>
                <Typography className={classes.padding} />
            </div>
            <div className={classes.demo2}>
                <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Workflows" />
                    <StyledTab label="Datasets" />
                    <StyledTab label="Connections" />
                </StyledTabs>
                <Typography className={classes.padding} />
            </div>
        </div>
    );
}
