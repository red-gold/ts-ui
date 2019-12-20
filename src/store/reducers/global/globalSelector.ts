import {Map} from 'immutable'
import { DialogType } from 'models/common/dialogType'
import { createSelector } from 'reselect'

const getCaller = (state: Map<string, any>) => {
    return state.getIn(['global', 'temp', 'caller'])
}

const getProgress = (state: Map<string, any>) => {
    return state.getIn(['global', 'progress'])
}

const getFeedbackStatus = (state: Map<string, any>) => {
    return state.getIn(['global', 'sendFeedbackStatus'])
}

const getDialogState = (state: Map<string, any>, props: {type: DialogType}) => {
    return state.getIn(['global', 'dialog', props.type, 'open'], false)
}

const getGlobal = (state: Map<string, any>) => {
    return state.get('global')
}

/****************************
 * Selectors
 ***************************/
const selectDialogState = () => {
    return createSelector(
        [getDialogState],
        (state) => state
    )
}

const selectProgress = () => {
    return createSelector(
        [getProgress],
        (progress) => progress
    )
}

const selectFeedbackStatus = () => {
    return createSelector(
        [getFeedbackStatus],
        (status) => status
    )
}

const selectGlobal = () => {
    return createSelector(
        [getGlobal],
        (status) => status
    )
}

export const globalSelector = {
    getCaller,
    getGlobal,
    getFeedbackStatus,
    getProgress,
    selectDialogState,
    selectProgress,
    selectFeedbackStatus,
    selectGlobal
}