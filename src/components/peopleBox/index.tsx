// - Import react components
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IPeopleBoxProps } from './IPeopleBoxProps';
import { IPeopleBoxState } from './IPeopleBoxState';
import { connectPeopleBox } from './connectPeopleBox';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UserItem from '../userItem';
import List from '@material-ui/core/List/List';

/**
 * Create component class
 */
export class PeopleBox extends Component<IPeopleBoxProps & WithTranslation, IPeopleBoxState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IPeopleBoxProps & WithTranslation) {
        super(props);
    }

    componentDidMount() {
        const { fetchUserSuggestions } = this.props;
        fetchUserSuggestions();
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { classes, t, currentUser, goTo, userSuggestions } = this.props;
        if (!currentUser) {
            return <div />;
        }
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {t('rightPanel.suggestionTitle')}
                    </Typography>
                    <List className={classes.listRoot}>
                        {userSuggestions
                            .map((user) => (
                                <UserItem follow key={`${user.get('userId')}-user-item`} user={user} goTo={goTo} />
                            ))
                            .valueSeq()}
                    </List>
                </CardContent>
                <CardActions>
                    <Button onClick={() => goTo('/people')} size="small">
                        {t('rightPanel.findFriendsBtn')}
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default connectPeopleBox(PeopleBox);
