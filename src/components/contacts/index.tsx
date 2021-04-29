// - Import react components
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import { IContactsProps } from './IContactsProps';
import { IContactsState } from './IContactsState';
import { connectContacts } from './connectContacts';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import UserItem from '../userItem';
import List from '@material-ui/core/List/List';
import { Map } from 'immutable';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Create component class
 */
export class Contacts extends Component<IContactsProps & WithTranslation, IContactsState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IContactsProps & WithTranslation) {
        super(props);
    }

    /**
     * Handle click contact
     */
    handleClickContact = (user: Map<string, any>) => {
        const { openRoom } = this.props;
        openRoom(user.get('roomId'));
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { classes, t, currentUser, goTo, contacts, contactsLoaded } = this.props;
        if (!currentUser) {
            return <div />;
        }

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
                            onClick={this.handleClickContact}
                            key={`${user.get('userId')}-user-item`}
                            disableProfile
                            user={user}
                            goTo={goTo}
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
}

export default connectContacts(Contacts);
