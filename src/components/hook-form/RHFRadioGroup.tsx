// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Radio, RadioGroup, FormHelperText, FormControlLabel } from '@mui/material';

interface RHFRadioGroupProps {
  name?: string;
  options: SelectOption[];
}

interface SelectOption {
  key: string;
  value: any;
  label: string;
}


export default function RHFRadioGroup({
  name,
  options,
  ...other
}: RHFRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name||''}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <RadioGroup {...field} row {...other}>
            {options.map((option) => (
              <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
