import { Chip as MUIChip } from '@mui/material';
import type { ChipProps as MUIChipProps } from '@mui/material/Chip';

import { returnKeyValueString } from '../../../utils/methods';

type ChipProps = MUIChipProps & {
  field?: string;
  value: string;
};

const Chip = ({ field, value, ref, ...props }: ChipProps) => {
  const label = field ? returnKeyValueString({ [field]: value }, field) : value;

  return <MUIChip {...props} label={label} ref={ref} />;
};

export default Chip;
