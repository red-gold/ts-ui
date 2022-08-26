import UserBoxList from 'components/userBoxList/UserBoxListComponent';
import { Map } from 'immutable';
import { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { IFollowersComponentProps } from './IFollowersComponentProps';
import { IFollowersComponentState } from './IFollowersComponentState';

export class FollowersComponent extends Component<
    IFollowersComponentProps & WithTranslation,
    IFollowersComponentState
> {
    constructor(props: IFollowersComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    render() {
        const { t } = this.props;
        const { followers } = this.props;
        return (
            <div>
                {followers && followers.keySeq().count() !== 0 ? (
                    <div>
                        <div className="profile__title">{t('people.followersLabel')}</div>
                        <UserBoxList users={followers} />
                        <div style={{ height: '24px' }} />
                    </div>
                ) : (
                    <div className="g__title-center">{t('people.noFollowersLabel')}</div>
                )}
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => {
    const followers = state.getIn(['circle', 'userTieds'], Map({}));
    return {
        followers,
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(FollowersComponent);

export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(translateWrapper);
