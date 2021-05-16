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

import React from 'react';
import { useStyles } from './searchBoxStyles';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function SearchBoxComponent() {
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
            navigate(`/search/post?q=${searchText}`);
            handleCloseList();
        }
    };

    /**
     * Handle search users
     */
    const handleSearchUsers = () => {
        if (!StringAPI.isEmpty(searchText)) {
            navigate(`/search/user?q=${searchText}`);
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

export default SearchBoxComponent;
