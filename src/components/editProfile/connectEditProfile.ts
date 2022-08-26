import React from 'react'
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { userSelector } from 'redux/reducers/users/userSelector';
import { withStyles } from '@mui/styles';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as userActions from 'redux/actions/userActions';
import { User } from 'core/domain/users/user';
import { editProfileStyles } from './editProfileStyles';
import { IEditProfileProps, IDispatchProps, IOwnProps, IStateProps } from './IEditProfileProps';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        loadAvatarList: (userId: string) => dispatch(imageGalleryActions.dbFetchAvatarImages(userId)),
        loadCoverList: (userId: string) => dispatch(imageGalleryActions.dbFetchCoverImages(userId)),
        update: (info: User) => dispatch(userActions.dbUpdateUserInfo(info)),
        onRequestClose: () => dispatch(userActions.closeEditProfile()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectOpenEditProfile = userSelector.selectOpenEditProfile();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const avatarImages = List() as List<Map<string, any>>;
        const coverImages = List() as List<Map<string, any>>;
        const open = selectOpenEditProfile(state);
        return {
            open,
            currentUser,
            avatarImages,
            coverImages,
        };
    };
    return mapStateToProps;
};

export const connectEditProfile = (component: React.ComponentType<IEditProfileProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(editProfileStyles)(translateWrapper) as React.ComponentType<IEditProfileProps>);
};
