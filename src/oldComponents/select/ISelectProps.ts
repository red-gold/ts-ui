import { InputProps } from '@mui/material/Input';

export interface ISelectProps extends InputProps {
    /**
     * Styles
     */
    classes?: any;

    /**
     * Select options
     */
    options: { label: string; value: string }[];

    /**
     * Helper text
     */
    helper?: string;
}
