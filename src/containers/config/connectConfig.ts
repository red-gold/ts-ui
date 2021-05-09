import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as userSettingActions from 'store/actions/userSettingActions';

import { IDispatchProps, IOwnProps, IConfigProps, IStateProps } from './IConfigProps';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { configStyles } from './configStyles';
import { userSettingSelector } from 'store/reducers/userSetting/userSettingSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        updateUserSetting: (type: string, setting: object) =>
            dispatch(userSettingActions.dbUpdateUserSetting(type, setting)),
        getUserSetting: () => dispatch(userSettingActions.dbFetchUserSetting()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectUserSetting = userSettingSelector.selectUserSetting();

    const mapStateToProps = (state: Map<string, any>) => {
        const userSetting = selectUserSetting(state);
        return {
            userSetting,
        };
    };
    return mapStateToProps;
};

export const connectConfig = (component: React.ComponentType<IConfigProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(configStyles, { withTheme: true })(translateWrapper));
};
