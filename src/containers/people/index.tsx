import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FindPeople from 'components/findPeople/FindPeopleComponent';
import Followers from 'components/followers';
import Following from 'components/following';
import YourCircles from 'components/yourCircles';
import * as globalActions from 'store/actions/globalActions';

import { IPeopleComponentProps } from './IPeopleComponentProps';
import { IPeopleComponentState } from './IPeopleComponentState';
import { AntTab, AntTabs } from 'components/tab';

const TabContainer = (props: any) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
};

/**
 * Create component class
 */
export class PeopleComponent extends Component<IPeopleComponentProps & WithTranslation, IPeopleComponentState> {
    static propTypes = {};

    /**
     * Component constructor
     *
     */
    constructor(props: IPeopleComponentProps & WithTranslation) {
        super(props);
        const { tab } = this.props.match.params;
        // Defaul state
        this.state = {
            tabIndex: this.getTabIndexByNav(tab),
        };

        // Binding functions to `this`
    }

    /**
     * Hadle on tab change
     */
    handleChangeTab = (event: any, value: any) => {
        const { goTo, setHeaderTitle, t } = this.props;
        this.setState({ tabIndex: value });
        if (!goTo || !setHeaderTitle || !t) {
            return;
        }
        switch (value) {
            case 0:
                goTo('/people');
                setHeaderTitle(t('header.peopleCaption'));
                break;
            case 1:
                goTo('/people/circles');
                setHeaderTitle(t('header.circlesCaption'));
                break;
            case 2:
                goTo('/people/followers');
                setHeaderTitle(t('header.followersCaption'));
                break;

            default:
                break;
        }
    };

    componentDidMount() {
        const { setHeaderTitle, t } = this.props;
        const { tab } = this.props.match.params;
        if (!setHeaderTitle || !t) {
            return;
        }
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
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        /**
         * Component styles
         */
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

        const { circlesLoaded, t } = this.props;
        const { tabIndex } = this.state;
        if (!t) {
            return <div />;
        }
        return (
            <div style={styles.people}>
                <AntTabs
                    indicatorColor={'secondary'}
                    onChange={this.handleChangeTab}
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

    /**
     * Get tab index by navigation name
     */
    private getTabIndexByNav: (navName: string) => number = (navName: string) => {
        switch (navName) {
            case 'circles':
                return 1;
            case 'followers':
                return 2;
            default:
                return 0;
        }
    };
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        goTo: (url: string) => dispatch(push(url)),
        setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => {
    return {
        uid: state.getIn(['authorize', 'uid'], 0),
        circlesLoaded: state.getIn(['circle', 'loaded']),
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(PeopleComponent);

export default withRouter(
    connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(translateWrapper as any) as any,
);
