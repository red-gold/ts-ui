import { AntTab, AntTabs } from 'components/tab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as globalActions from 'store/actions/globalActions';

import { ISearchProps } from './ISearchProps';
import { useStyles } from './searchStyles';

const getTabIndexByNav = (navName: string) => {
    switch (navName) {
        case 'people':
            return 1;
        default:
            return 0;
    }
};

export function SearchComponent(props: ISearchProps) {
    const { tab } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const goTo = (url: string) => navigate(url);
    const setHeaderTitle = (title: string) => dispatch(globalActions.setHeaderTitle(title));
    const [tabIndex, setTabIndex] = React.useState(getTabIndexByNav(tab));
    const classes = useStyles();

    /**
     * Hadle on tab change
     */
    const handleChangeTab = (event: any, value: any) => {
        setTabIndex(value);
        switch (value) {
            case 0:
                goTo(`/search/post${location.search}`);
                setHeaderTitle(t('header.peopleCaption'));
                break;
            case 1:
                goTo(`/search/user${location.search}`);
                setHeaderTitle(t('header.circlesCaption'));
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        switch (getTabIndexByNav(tab)) {
            case undefined:
            case 0:
                setHeaderTitle(t('header.peopleCaption'));
                break;
            case 1:
                setHeaderTitle(t('header.circlesCaption'));
                break;
            default:
                break;
        }
    }, []);

    const styles = {
        people: {
            margin: '0 auto',
        },
        headline: {
            fontSize: 24,
            paddingTop: 16,
            marginBottom: 12,
            fontWeight: 400,
        },
        slide: {
            padding: 10,
        },
    };

    const { children } = props;
    return (
        <div style={styles.people}>
            <AntTabs
                indicatorColor={'secondary'}
                onChange={handleChangeTab}
                value={tabIndex}
                centered
                textColor="primary"
            >
                <AntTab label={t('search.posts')} />
                <AntTab label={t('search.users')} />
            </AntTabs>
            <div className={classes.container}>{children}</div>
        </div>
    );
}

export default SearchComponent;
