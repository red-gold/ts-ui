import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import BackIcon from '@mui/icons-material/ArrowBack';
import { userPermissionStyles } from 'components/userPermission/userPermissionStyles';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { circleSelector } from 'redux/reducers/circles/circleSelector';

import { IUserPermissionProps } from './IUserPermissionProps';
import { IUserPermissionState } from './IUserPermissionState';

// - Material UI
// - Import app components

// - Import API
// - Import actions
/**
 * React component class
 */
export class UserPermissionComponent extends Component<IUserPermissionProps & WithTranslation, IUserPermissionState> {
    constructor(props: IUserPermissionProps & WithTranslation) {
        super(props);
        const { access } = props;
        // Defaul state
        this.state = {
            selectedValue: access,
            disabledOk: true,
        };

        // Binding functions to `this`
    }

    /**
     * Handle add link
     */
    handleSetPermission = (selectedValue: UserPermissionType) => {
        const { onAddAccessList, followingIds, currentUser } = this.props;
        let accessList: string[] = [];
        if (selectedValue === UserPermissionType.Circles && followingIds && currentUser && currentUser.userId) {
            accessList = followingIds;
            accessList.push(currentUser.userId);
        }
        onAddAccessList(accessList, selectedValue);
    };

    /**
     * Handle data on input change
     */
    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t, open, onClose } = this.props;
        const { selectedValue } = this.state;
        return (
            <Dialog PaperProps={{ className: classes.fullPageXs }} open={open} onClose={onClose} maxWidth="md">
                <DialogActions className={classes.dialogAction}>
                    <Typography variant={'h6'} component={'div'} className={classes.galleryDialogTitle}>
                        <IconButton className={classes.header} onClick={onClose}>
                            <BackIcon />
                        </IconButton>
                        {t('permission.titleLabel')}
                    </Typography>
                </DialogActions>
                <DialogContent className={classes.dialogContent}>
                    <FormControl component="div" required className={classes.formControl}>
                        <RadioGroup
                            aria-label="selectedValue"
                            name="selectedValue"
                            className={classes.group}
                            value={selectedValue}
                            onChange={this.handleInputChange}
                        >
                            <FormControlLabel
                                className={classes.permissionItem}
                                onClick={() => this.handleSetPermission(UserPermissionType.OnlyMe)}
                                value={UserPermissionType.OnlyMe}
                                control={<Radio />}
                                label={t('permission.onlyMe')}
                            />

                            <FormControlLabel
                                className={classes.permissionItem}
                                onClick={() => this.handleSetPermission(UserPermissionType.Public)}
                                value={UserPermissionType.Public}
                                control={<Radio />}
                                label={t('permission.public')}
                            />

                            <FormControlLabel
                                className={classes.permissionItem}
                                onClick={() => this.handleSetPermission(UserPermissionType.Circles)}
                                value={UserPermissionType.Circles}
                                control={<Radio />}
                                label={t('permission.circles')}
                            />

                            <FormControlLabel
                                className={classes.permissionItem}
                                value={UserPermissionType.Custom}
                                disabled
                                control={<Radio />}
                                label={t('permission.custom')}
                            />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
            </Dialog>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};
/**
 * Make map state to props
 */
const makeMapStateToProps = () => {
    const selectFollowingIds = circleSelector.selectFollowingIds();
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const mapStateToProps = (state: Map<string, any>) => {
        const followingIds = selectFollowingIds(state);
        const currentUser = selectCurrentUser(state).toJS();
        return {
            followingIds,
            currentUser,
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(UserPermissionComponent);

export default connect<{}, {}, any, any>(
    makeMapStateToProps,
    mapDispatchToProps,
)(withStyles(userPermissionStyles as any)(translateWrapper as any) as any);
