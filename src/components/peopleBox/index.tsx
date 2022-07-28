import React from 'react';
import { Map } from 'immutable';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List/List';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from 'redux/actions/userActions';
import { userSelector } from 'redux/reducers/users/userSelector';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import UserItem from '../userItem';
import { useStyles } from './peopleBoxStyles';

const selectUserSuggestions = userSelector.selectUserSuggestions();

export function PeopleBox() {
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Dispatcher
    const dispatch = useDispatch();
    const fetchUserSuggestions = () => dispatch<any>(userActions.fetchUserSuggestions());

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
