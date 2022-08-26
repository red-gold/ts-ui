import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import { Map } from 'immutable';
import React from 'react';

import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { CardContent, ListSubheader } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as userSettingActions from 'redux/actions/userSettingActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useStyles } from './langSettingStyles';
import { ILangSettingProps } from './ILangSettingProps';

export function LangSettingComponent(props: ILangSettingProps) {
    const [selectedLang, setSelectedLang] = React.useState(props.userSettings.get('lang', Map({})));
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedLang(selectedLang.setIn(['current', 'value'], event?.target.value as string));
    };

    /**
     * Handle save changes
     */
    const handleSaveChanges = () => {
        const { updateUserSetting } = props;
        dispatch<any>(userSettingActions.changeCurrentLang(selectedLang.getIn(['current', 'value'], 'en')));
        updateUserSetting('lang', selectedLang);
    };

    return (
        <Paper className={classes.root}>
            <ListSubheader>{t('config.lang.currentLang')}</ListSubheader>
            <CardContent>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t('config.lang.currentLangCaption')}</InputLabel>
                    <Select
                        value={selectedLang.getIn(['current', 'value'], 'en')}
                        className={classes.selectEmpty}
                        onChange={handleChange}
                    >
                        <MenuItem value={'en'}>English</MenuItem>
                        <MenuItem value={'vi'}>Vietnamese</MenuItem>
                        <MenuItem value={'zh'}>Chinese</MenuItem>
                        <MenuItem value={'es'}>Spanish</MenuItem>
                    </Select>
                </FormControl>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button color="primary" onClick={handleSaveChanges}>
                    {t('config.saveChangesButton')}{' '}
                </Button>
            </CardActions>
        </Paper>
    );
}

export default LangSettingComponent;
