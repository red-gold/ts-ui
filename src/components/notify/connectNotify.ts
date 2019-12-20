// import { User } from 'core/domain/users';
// import { Map } from 'immutable';
// import { DialogType } from 'models/common/dialogType';
// import { Component } from 'react';
// import { connect } from 'react-redux';
// import * as globalActions from 'store/actions/globalActions';
// import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
// import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
// import { globalSelector } from 'store/reducers/global/globalSelector';
// import { serverSelector } from 'store/reducers/server/serverSelector';
// import { INotifyComponentProps } from './INotifyComponentProps';
// import StringAPI from 'api/StringAPI';
// import { ServerRequestType } from 'constants/serverRequestType';
// import { withTranslation } from 'react-i18next';
// import withStyles from '@material-ui/styles/withStyles/withStyles';

// /**
//  * Map dispatch to props
//  */
// const mapDispatchToProps = (dispatch: any, ownProps: INotifyComponentProps) => {
//     return {
       
//     }
// }

// /**
//  * Map state to props
//  */
// const makeMapStateToProps = () => {
//     const selectCurrentUser = authorizeSelector.selectCurrentUser()
//     const selectRequest = serverSelector.selectRequest()
//     const mapStateToProps = (state: Map<string, any>, ownProps: INotifyComponentProps) => {
     
//         const currentUser = selectCurrentUser(state)
        
//         return {
//             uid: currentUser.get('userId', ''),
//             avatar: currentUser.get('avatar', ''),
//             fullName: currentUser.get('fullName', '')
//         }

//     }
//     return mapStateToProps
// }

// // - Connect component to redux store
// export const connectNotify =
//     (component: Component<INotifyComponentProps>) => {
//         const translateWrapper = withTranslation('translations')(component as any)
//         return connect(makeMapStateToProps, mapDispatchToProps)(withStyles(notifyStyles as any)(translateWrapper as any))

//     }