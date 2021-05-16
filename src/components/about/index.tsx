import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import BirthdayIcon from '@material-ui/icons/EventRounded';
import CompanyIcon from '@material-ui/icons/BusinessRounded';
import WebIcon from '@material-ui/icons/PublicRounded';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import * as userActions from 'store/actions/userActions';
import { useTranslation } from 'react-i18next';
import { useStyles } from './peopleBoxStyles';
import { IAboutProps } from './IAboutProps';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import moment from 'moment/moment';
import { Link } from '@material-ui/core';
import { SocialIcon } from 'react-social-icons';

const ProfileItem = styled('div')({
    display: 'flex',
    marginTop: 16,
});
export function About({ profile, isCurrentUser }: IAboutProps) {
    const classes = useStyles();
    const { t } = useTranslation();

    // Dispatcher
    const dispatch = useDispatch();
    const fetchUserSuggestions = () => dispatch(userActions.fetchUserSuggestions());
    const openEditor = () => dispatch(userActions.openEditProfile());

    React.useEffect(() => {
        fetchUserSuggestions();
    }, []);
    let bio = profile.get('tagLine', t('profile.noBio'));
    bio = bio === '' ? t('profile.noBio') : bio;

    const birthday = profile.get('birthday');
    const birthdayText =
        birthday && birthday > 0
            ? moment(profile.get('birthday') * 1000).fromNow() + t('profile.comeToWorldAgeText')
            : moment(profile.get('creationDate')).fromNow() + t('profile.comeToSocialAgeText');

    const companyName = profile.get('companyName', '');
    const webUrl = profile.get('webUrl', '');
    const facebookId = profile.get('facebookId', '');
    const twitterId = profile.get('twitterId', '');
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    {t('profile.about')}
                </Typography>
                <Typography variant="body2" className={classes.title} color="textSecondary" gutterBottom>
                    {bio}
                </Typography>
                <ProfileItem>
                    <BirthdayIcon sx={{ marginRight: 1.5 }} />
                    <Typography variant="body2" className={classes.title} color="textPrimary" gutterBottom>
                        {birthdayText}
                    </Typography>
                </ProfileItem>
                {companyName !== '' && (
                    <ProfileItem>
                        <CompanyIcon sx={{ marginRight: 1.5 }} />
                        <Typography variant="body2" className={classes.title} color="textPrimary" gutterBottom>
                            {companyName}
                        </Typography>
                    </ProfileItem>
                )}
                {webUrl !== '' && (
                    <ProfileItem>
                        <WebIcon sx={{ marginRight: 1.5 }} />

                        <Typography variant="body2" className={classes.title} color="textPrimary" gutterBottom>
                            <Link href={webUrl}>{webUrl}</Link>
                        </Typography>
                    </ProfileItem>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                {facebookId !== '' && (
                    <SocialIcon className={classes.socialIcon} url={'https://www.facebook.com/' + facebookId} />
                )}
                {twitterId !== '' && (
                    <SocialIcon className={classes.socialIcon} url={'https://twitter.com/' + twitterId} />
                )}
            </CardActions>
            {isCurrentUser && (
                <CardActions>
                    <Button onClick={() => openEditor()} size="small">
                        {t('profile.editProfileButton')}
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

export default About;
