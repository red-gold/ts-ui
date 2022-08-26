import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

// - Material-UI
import { withStyles } from '@mui/styles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClearIcon from '@mui/icons-material/Clear';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { ICreateSelectProps } from './ICreateSelectProps';
import { createSelectStyles } from './createSelectStyles';

class Option extends React.Component<any, any> {
    handleClick = (event: any) => {
        this.props.onSelect(this.props.option, event);
    };

    render() {
        const { children, isFocused, isSelected, onFocus } = this.props;

        return (
            <MenuItem
                onFocus={onFocus}
                selected={isFocused}
                onClick={this.handleClick}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {children}
            </MenuItem>
        );
    }
}

const SelectWrapped = (props: any) => {
    const { classes, ...other } = props;

    return (
        <CreatableSelect
            promptTextCreator={(label: string) => `Create tag "${label}"`}
            optionComponent={Option}
            newOptionCreator={(value: any) => {
                return {
                    [value.labelKey]: value.label.toLocaleLowerCase(),
                    [value.valueKey]: value.label.toLocaleLowerCase(),
                };
            }}
            noResultsText={<Typography>{'No results found'}</Typography>}
            arrowRenderer={(arrowProps: any) => {
                return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
            }}
            clearRenderer={() => <ClearIcon />}
            valueComponent={(valueProps: any) => {
                const { value, children, onRemove } = valueProps;

                const onDelete = (event: any) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(value);
                };

                if (onRemove) {
                    return (
                        <Chip
                            tabIndex={-1}
                            label={children}
                            className={classes.chip}
                            deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
                            onDelete={onDelete}
                        />
                    );
                }

                return <div className="Select-value">{children}</div>;
            }}
            {...other}
        />
    );
};

const CreateSelect = (props: ICreateSelectProps) => {
    return (
        <FormControl error={props.error} fullWidth={props.fullWidth}>
            <Input
                {...{ ...props, classes: undefined, options: undefined, helper: undefined, touched: undefined }}
                inputComponent={SelectWrapped}
                inputProps={{
                    classes: props.classes,
                    multi: true,
                    instanceId: `innerInstance-${props.id}`,
                    simpleValue: true,
                    options: props.options,
                    name: props.name,
                    id: props.name,
                }}
            />
            <FormHelperText id={`helper-${props.id}`}>{props.helper}</FormHelperText>
        </FormControl>
    );
};

export default withStyles(createSelectStyles as any)(CreateSelect);
