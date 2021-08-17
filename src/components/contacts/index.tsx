import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import UserItem from '../userItem';
import List from '@material-ui/core/List/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import * as chatActions from 'redux/actions/chatActions';
import { chatSelector } from 'redux/reducers/chat/chatSelector';
import { Map } from 'immutable';
import { useStyles } from './contactsStyles';

const selectContacts = chatSelector.selectContacts();
const selectRoomLoaded = chatSelector.selectRoomLoaded();

export default function Contacts() {
    const classes = useStyles();
    const { t } = useTranslation();

    // Dispatchers
    const dispatch = useDispatch();
    const openRoom = (roomId: string) => dispatch(chatActions.openRoom(roomId));

    // Selectors
    const contacts = useSelector((state: Map<string, any>) => selectContacts(state));
    const contactsLoaded = useSelector((state: Map<string, any>) => selectRoomLoaded(state));

    /**
     * Handle click contact
     */
    const handleClickContact = (user: Map<string, any>) => {
        openRoom(user.get('roomId'));
    };

    const progress = (
        <div className={classes.progress}>
            <CircularProgress size={20} />
        </div>
    );

    const contactsList = (
        <List className={classes.listRoot}>
            {contacts
                .map((user) => (
                    <UserItem
                        onClick={handleClickContact}
                        key={`${user.get('userId')}-user-item`}
                        disableProfile
                        user={user}
                    />
                ))
                .valueSeq()}
        </List>
    );

    const noOneInYourContacts = (
        <div>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                {t('rightPanel.noOneInContacts')}
            </Typography>
        </div>
    );
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {t('rightPanel.contactsTitle')}
                </Typography>
                {contactsLoaded ? (contacts.size > 0 ? contactsList : noOneInYourContacts) : progress}
            </CardContent>
        </Card>
    );
}
