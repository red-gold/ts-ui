import React from 'react';
import { Map } from 'immutable';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UserItem from '../userItem';
import List from '@material-ui/core/List/List';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useStyles } from './peopleBoxStyles';

const selectUserSuggestions = userSelector.selectUserSuggestions();

export function PeopleBox() {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Dispatcher
    const dispatch = useDispatch();
    const fetchUserSuggestions = () => dispatch(userActions.fetchUserSuggestions());

    // Selectors
    const userSuggestions = useSelector((state: Map<string, any>) => selectUserSuggestions(state));

    React.useEffect(() => {
        fetchUserSuggestions();
    }, []);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {t('rightPanel.suggestionTitle')}
                </Typography>
                <List className={classes.listRoot}>
                    {userSuggestions
                        .map((user) => <UserItem follow key={`${user.get('userId')}-user-item`} user={user} />)
                        .valueSeq()}
                </List>
            </CardContent>
            <CardActions>
                <Button onClick={() => navigate('/people')} size="small">
                    {t('rightPanel.findFriendsBtn')}
                </Button>
            </CardActions>
        </Card>
    );
}

export default PeopleBox;
