import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import * as globalActions from 'redux/actions/globalActions';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material';

// ----------------------------------------------------------------------

const ReactMarkdownStyle = styled(ReactMarkdown)({
    whiteSpace: 'pre-wrap',
});
// ----------------------------------------------------------------------

export function SupportComponent() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch<any>(globalActions.setHeaderTitle(t('header.support')));
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
