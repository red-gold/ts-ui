// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Checkbox, FormControlLabel, FormControlLabelProps, FormGroup } from '@mui/material';

interface RHFCheckboxProps extends FormControlLabelProps{
  name: string;
}

export function RHFCheckbox({
  name,
  ...other
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
    {...other}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
    />
  );
}

interface RHFMultiCheckboxProps {
  name: string;
  options: SelectOption[];
}

interface SelectOption {
  key: string;
  value: any;
  label: string;
}

export function RHFMultiCheckbox({
  name,
  options,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option: any) =>
          field.value.includes(option) ? field.value.filter((value: any) => value !== option) : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={option.label}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
