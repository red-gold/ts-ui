import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { IRoute } from './IRoute';
import { Map } from 'immutable';

export class PrivateRoute extends Component<IRoute, any> {
    render() {
        const { authed, component: Component, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={(props) =>
                    authed ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location },
                            }}
                        />
                    )
                }
            />
        );
    }
}

const mapStateToProps = (state: Map<string, any>) => {
    return {
        authed: state.getIn(['authorize', 'authed']),
    };
};

export default connect<{}, {}, any, any>(mapStateToProps)(PrivateRoute as any);
