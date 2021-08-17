import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PATH_MAIN } from 'routes/paths';
// material
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import SearchIcon from '@material-ui/icons/Search';
import StringAPI from 'api/StringAPI';
import Card from '@material-ui/core/Card';
import { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';

export default function SearchBoxComponent() {
    const [searchText, setSearchText] = React.useState('');
    const [listDisplayed, setListDisplayed] = React.useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const classes = useStyles();
    /**
     * Handle search on change
     */
    const handleChange = (prop: any) => (event: any) => {
        let listDisplayed = false;
        if (prop === 'searchText') {
            listDisplayed = true;
        }
        setSearchText(event.target.value);
        setListDisplayed(listDisplayed);
    };

    /**
     * Handle open search list
     */
    const handleOpenList = () => {
        setListDisplayed(true);
    };

    /**
     * Handle close search list
     */
    const handleCloseList = () => {
        setListDisplayed(false);
    };

    /**
     * Handle search posts
     */
    const handleSearchPosts = () => {
        if (!StringAPI.isEmpty(searchText)) {
            const categoryParam = 'posts';
            navigate(PATH_MAIN.search.root.replace(':category', `${categoryParam}?q=${searchText}`));
            handleCloseList();
        }
    };

    /**
     * Handle search users
     */
    const handleSearchUsers = () => {
        if (!StringAPI.isEmpty(searchText)) {
            const categoryParam = 'people';
            navigate(PATH_MAIN.search.root.replace(':category', `${categoryParam}?q=${searchText}`));
            handleCloseList();
        }
    };

    /**
     * Handle mouse down prevent default
     */
    const handleMouseDown = (event: any) => {
        event.preventDefault();
    };

    const searchList = (
        // <div className={classNames(classes.searchList)}>
        <Card className={classes.searchList} variant="outlined">
            <ListItem button onMouseDown={handleMouseDown} onClick={handleSearchPosts} className={classes.listItem}>
                <ListItemIcon>
                    <div className={classes.searchIconRoot}>
                        <SearchIcon className={classes.searchItemIcon} />
                    </div>
                </ListItemIcon>
                <ListItemText
                    classes={{ primary: classes.searchItemText }}
                    primary={t('search.searchInPost', { query: searchText })}
                />
            </ListItem>
            <ListItem button onClick={handleSearchUsers} onMouseDown={handleMouseDown} className={classes.listItem}>
                <ListItemIcon>
                    <div className={classes.searchIconRoot}>
                        <GroupIcon className={classes.searchItemIcon} />
                    </div>
                </ListItemIcon>
                <ListItemText
                    classes={{ primary: classes.searchItemText }}
                    primary={t('search.searchInUser', { query: searchText })}
                />
            </ListItem>
        </Card>
        // </div>
    );

    return (
        <FormControl fullWidth component="div" className={classes.searchField}>
            <Input
                className={classes.searchInput}
                onBlur={handleCloseList}
                id="adornment-password"
                placeholder={t('header.searchText')}
                type={'text'}
                disableUnderline
                value={searchText}
                onClick={handleOpenList}
                onChange={handleChange('searchText')}
                autoComplete="off"
                startAdornment={
                    <InputAdornment position="end">
                        <SearchIcon className={classes.searchIcon} onMouseDown={handleMouseDown} />
                    </InputAdornment>
                }
            />
            {searchText !== '' && listDisplayed ? searchList : <span> </span>}

            {/* </ClickAwayListener> */}
        </FormControl>
    );
}

// ----------------------------------------------------------------------

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#a5792a',
        },
        flex: {
            flex: 1,
        },
        pageTitle: {
            color: theme.palette.common.white,
            borderLeftColor: theme.palette.common.white,
        },
        appIcon: {
            width: 40,
            height: 40,
            marginLeft: 10,
        },
        searchInput: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: theme.palette.common.white + ' !important',
            padding: 5,
            borderRadius: 4,
        },
        searchField: {
            'margin-left': '20px !important',
            maxWidth: 720,
        },
        searchIcon: {
            marginLeft: 0,
            marginRight: 9,
            color: theme.palette.common.white,
        },
        searchButton: {},
        searchItemIcon: {
            width: 18,
            height: 18,
            color: theme.palette.common.black,
        },
        searchList: {
            maxHeight: 384,
            maxWidth: 820,
            top: 47,
            position: 'absolute',
            right: 0,
            left: 0,
            zIndex: 1,
            outline: 'none',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
        },
        searchIconRoot: {
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.common.white,
            color: theme.palette.common.white,
            marginRight: 0,
        },
        listItem: {
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 16,
            paddingRight: 16,
        },
        searchItemText: {
            fontWeight: 400,
            paddingLeft: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: theme.palette.common.black,
            display: 'block',
        },
        noDisplay: {
            display: 'none',
        },
    }),
);
