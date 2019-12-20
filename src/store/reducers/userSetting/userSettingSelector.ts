import { Map } from 'immutable'
import { createSelector } from 'reselect'

const getUserSetting = (state: Map<string, any>) => {
    return state.getIn(['userSetting', 'entities'], Map({})) as Map<string, any>
}

/****************************
 * Selectors
 ***************************/
const selectFindPeoplePage = () => {
    return createSelector(
        [getUserSetting],
        (setting) => setting
    )
}

export const userSettingSelector = {
    getUserSetting,
    selectUserSetting: selectFindPeoplePage
}