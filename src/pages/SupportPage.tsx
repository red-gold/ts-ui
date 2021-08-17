import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useDispatch } from 'react-redux';
import * as globalActions from 'redux/actions/globalActions';
import ReactMarkdown from 'react-markdown';
import { styled } from '@material-ui/core';

// ----------------------------------------------------------------------

const ReactMarkdownStyle = styled(ReactMarkdown)({
    whiteSpace: 'pre-wrap',
});
// ----------------------------------------------------------------------

export function SupportComponent() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(globalActions.setHeaderTitle(t('header.support')));
    }, []);

    return (
        <Container maxWidth="md">
            <Typography component="div" variant="subtitle1">
                <ReactMarkdownStyle>{t('support.content')}</ReactMarkdownStyle>
            </Typography>
        </Container>
    );
}

export default SupportComponent;
