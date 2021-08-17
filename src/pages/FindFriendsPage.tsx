import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FindPeople from 'components/findPeople/FindPeopleComponent';
import Followers from 'components/followers';
import Following from 'components/following';
import YourCircles from 'components/yourCircles';
import * as globalActions from 'redux/actions/globalActions';
import { useTranslation } from 'react-i18next';
import { AntTab, AntTabs } from 'components/tab';
import { useNavigate, useParams } from 'react-router';
import { circleSelector } from 'redux/reducers/circles/circleSelector';
import { PATH_MAIN } from 'routes/paths';

const TabContainer = (props: any) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
};

const getTabIndexByNav = (navName: string) => {
    switch (navName) {
        case 'circles':
            return 1;
        case 'followers':
            return 2;
        default:
            return 0;
    }
};
export function FindFriendsPage() {
    const { tab } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const goTo = (url: string) => navigate(url);
    const setHeaderTitle = (title: string) => dispatch(globalActions.setHeaderTitle(title));
    const circlesLoaded = useSelector(circleSelector.selectCirclesLoaded());
    const [tabIndex, setTabIndex] = React.useState(getTabIndexByNav(tab));

    /**
     * Hadle on tab change
     */
    const handleChangeTab = (event: any, value: any) => {
        setTabIndex(value);

        switch (value) {
            case 0:
                goTo(PATH_MAIN.user.friends);
                break;
            case 1:
                goTo(PATH_MAIN.user.friendsTab.replace(':tab', 'circles'));
                break;
            case 2:
                goTo(PATH_MAIN.user.friendsTab.replace(':tab', 'followers'));
                break;

            default:
                break;
        }
    };

    React.useEffect(() => {
        switch (tab) {
            case undefined:
            case '':
                setHeaderTitle(t('header.peopleCaption'));
                break;
            case 'circles':
                setHeaderTitle(t('header.circlesCaption'));
                break;
            case 'followers':
                setHeaderTitle(t('header.followersCaption'));
                break;
            default:
                break;
        }
    }, [tab]);

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

    return (
        <div style={styles.people}>
            <AntTabs
                indicatorColor={'secondary'}
                onChange={handleChangeTab}
                value={tabIndex}
                centered
                textColor="primary"
            >
                <AntTab label={t('people.findPeopleTab')} />
                <AntTab label={t('people.followingTab')} />
                <AntTab label={t('people.followersTab')} />
            </AntTabs>
            {tabIndex === 0 && <TabContainer>{circlesLoaded ? <FindPeople /> : ''}</TabContainer>}
            {tabIndex === 1 && (
                <TabContainer>
                    {circlesLoaded ? <Following /> : ''}
                    {circlesLoaded ? <YourCircles /> : ''}
                </TabContainer>
            )}
            {tabIndex === 2 && <TabContainer>{circlesLoaded ? <Followers /> : ''}</TabContainer>}
        </div>
    );
}

export default FindFriendsPage;
