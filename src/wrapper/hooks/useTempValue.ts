import { useState } from 'react';

export const useTempValue = <T>(
  initialValue: T,
): [T, T, (newValue: T, updateMainValue?: boolean) => void, () => void] => {
  const [value, setValue] = useState<T>(initialValue);
  const [tempValue, setTempValue] = useState<T>(initialValue);

  const makeTheChange = () => {
    setValue(tempValue);
  };

  const setTempValueWrapper = (newValue: T, updateMainValue?: boolean) => {
    setTempValue(newValue);
    if (updateMainValue) setValue(newValue);
  };

  return [value, tempValue, setTempValueWrapper, makeTheChange];
};
