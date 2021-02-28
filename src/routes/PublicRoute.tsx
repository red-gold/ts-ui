import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { IRoute } from './IRoute';
import { Map } from 'immutable';

export class PublicRoute extends Component<IRoute, any> {
    render() {
        const { authed, component: Component, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={(props) =>
                    authed ? (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    ) : (
                        <Component {...props} />
                    )
                }
            />
        );
    }
}

const mapStateToProps = (state: Map<string, any>) => {
    return {
        authed: state.getIn(['authorize', 'authed', false]),
    };
};

export default connect<{}, {}, any, any>(mapStateToProps)(PublicRoute as any);
