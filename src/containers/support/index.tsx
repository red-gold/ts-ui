import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useDispatch } from 'react-redux';
import * as globalActions from 'store/actions/globalActions';
import ReactMarkdown from 'react-markdown';

export function SupportComponent() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(globalActions.setHeaderTitle(t('header.support')));
    }, []);

    return (
        <Container maxWidth="md">
            <Typography component="div" variant="subtitle1">
                <ReactMarkdown>{t('support.content')}</ReactMarkdown>
            </Typography>
        </Container>
    );
}

export default SupportComponent;
