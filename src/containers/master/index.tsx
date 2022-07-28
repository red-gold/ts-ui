import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';
import { Helmet } from 'react-helmet';
import MasterLoading from 'components/masterLoading';
import SendFeedback from 'components/sendFeedback';
import config from 'config';

// redux selectors
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { userSelector } from 'redux/reducers/users/userSelector';
import { useDispatch, useSelector } from 'redux/store';
// actions
import * as globalActions from 'redux/actions/globalActions';
// selctors
const selectProgress = globalSelector.selectProgress();
const selectFeedbackStatus = globalSelector.selectFeedbackStatus();
const selectGlobal = globalSelector.selectGlobal();
const selectUsers = userSelector.selectUsers();
// ----------------------------------------------------------------------

export interface MasterProps {
    children?: React.ReactNode;
}

export default function Master({ children }: MasterProps) {
    // dispatchers
    const dispatch = useDispatch();

    const hideMessage = () => dispatch<any>(globalActions.hideMessage());
    // state selectors
    const progress = useSelector(selectProgress);
    const sendFeedbackStatus = useSelector(selectFeedbackStatus);
    const global = useSelector(selectGlobal);
    const users = useSelector(selectUsers);

    const header = (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{config.header.title}</title>
            {config.header.meta && config.header.meta.length > 0
                ? config.header.meta.map((metaData) => (
                      <meta key={metaData.name} name={metaData.name} content={metaData.content} />
                  ))
                : ''}
        </Helmet>
    );
    return (
        <>
            {header}
            {sendFeedbackStatus ? <SendFeedback /> : ''}
            <div className="master__progress" style={{ display: progress.get('visible') ? 'block' : 'none' }}>
                <LinearProgress variant="determinate" value={progress.get('percent', 0)} />
            </div>
            <div
                className="master__loading animate-fading2"
                style={{ display: global.get('showTopLoading') ? 'flex' : 'none' }}
            >
                <div className="title">Loading ... </div>
            </div>
            {progress.get('visible') ? <MasterLoading /> : ''}

            {children}
            <Snackbar
                open={global.get('messageOpen')}
                message={global.get('message')}
                onClose={hideMessage}
                autoHideDuration={4000}
                style={{ left: '1%', transform: 'none' }}
            />
        </>
    );
}
