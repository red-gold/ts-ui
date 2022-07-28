import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { withStyles } from '@mui/styles';
import Table from '@mui/material/Table/Table';
import TableBody from '@mui/material/TableBody/TableBody';
import TableCell from '@mui/material/TableCell/TableCell';
import TableRow from '@mui/material/TableRow/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import classNames from 'classnames';
import React, { Component } from 'react';
import { TransitionProps } from '@mui/material/transitions';

import { ITimelineComponentProps } from './ITimelineComponentProps';
import { ITimelineComponentState } from './ITimelineComponentState';
import { timelineStyles } from './timelineStyles';

const Transition = React.forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement<any, any>;
        },
        ref: React.Ref<unknown>,
    ) => <Slide direction="up" ref={ref} {...props} />,
);

export class TimelineComponent extends Component<ITimelineComponentProps, ITimelineComponentState> {
    /**
     * Reneder component DOM
     */
    render() {
        const { classes, title, onClose, open } = this.props;
        let id = 0;
        function createData(rep: number, status: string, info: string, isActive: boolean) {
            id += 1;
            return { id, rep, status, info, isActive };
        }

        const data = [
            createData(50, 'Trusted User', 'Creat more vote per day ', false),
            createData(15, 'Verified User', 'Able to vote', false),
            createData(5, 'Approved User', 'Creat more analysis', false),
            createData(1, 'Read Only', 'View a certain of polis result', true),
        ];
        return (
            <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={onClose} aria-label="Close">
                            <VpnKeyIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            {title}
                        </Typography>
                        <IconButton color="inherit" onClick={onClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Typography variant="body1" color="inherit" className={classes.description}>
                    Privileges manage your accessibility on features and what you can do on Poll Social . Following
                    privileges guidline gaining more reputation and privileges.
                </Typography>
                <Table
                    classes={{
                        root: this.props.classes.table,
                    }}
                >
                    <TableBody>
                        {data.map((item) => (
                            <TableRow className={classes.row} key={item.id}>
                                <TableCell className={classes.cell} align="right">
                                    {item.isActive ? <DoneIcon className={classes.doneIcon} /> : null}
                                </TableCell>
                                <TableCell
                                    className={classNames(
                                        classes.cell,
                                        { [classes.notactiveColor]: !item.isActive },
                                        { [classes.activeColor]: item.isActive },
                                    )}
                                >
                                    {item.rep}
                                </TableCell>
                                <TableCell
                                    className={classNames(
                                        classes.cell,
                                        { [classes.notactiveColor]: !item.isActive },
                                        { [classes.activeColor]: item.isActive },
                                    )}
                                >
                                    {item.status}
                                </TableCell>
                                <TableCell
                                    className={classNames(
                                        classes.cell,
                                        { [classes.notactiveColor]: !item.isActive },
                                        { [classes.activeColor]: item.isActive },
                                    )}
                                >
                                    {item.info}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Dialog>
        );
    }
}

// - Connect component to redux store
export default withStyles(timelineStyles as any)(TimelineComponent as any);
