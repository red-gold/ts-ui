
import List from '@material-ui/core/List';
import CircleComponent from 'components/circle/CircleComponent';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { IYourCirclesComponentProps } from './IYourCirclesComponentProps';
import { IYourCirclesComponentState } from './IYourCirclesComponentState';

// - Import app components
// - Import API

// - Import actions

export class YourCirclesComponent extends Component<
    IYourCirclesComponentProps & WithTranslation,
    IYourCirclesComponentState
> {
    static propTypes = {};

    constructor(props: IYourCirclesComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    circleList = () => {
        const { circles, uid } = this.props;
        const parsedCircles: any[] = [];

        if (circles) {
            circles.forEach((circle, key) => {
                if (key && circle && uid) {
                    parsedCircles.push(<CircleComponent key={key} circle={circle} id={key} uid={uid} />);
                }
            });
        }
        return parsedCircles;
    };

    render() {
        const { t } = this.props;
        const circleItems = this.circleList();
        return (
            <div
                style={{
                    maxWidth: '800px',
                    margin: '40px auto',
                }}
            >
                {circleItems && circleItems.length !== 0 ? (
                    <div>
                        <div className="profile__title">{t('yourCircles.title')}</div>
                        <List>{circleItems}</List>
                        <div style={{ height: '24px' }}></div>
                    </div>
                ) : (
                    ''
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
    const uid = state.getIn(['authorize', 'uid']);
    const circles: Map<string, Map<string, any>> = state.getIn(['circle', 'circleList'], {});
    return {
        uid,
        circles,
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(YourCirclesComponent);

export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(translateWrapper as any);
