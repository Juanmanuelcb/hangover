import * as React from 'react';
import { TextInput } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';

const fromList = [
  { label: 'Andres', value: 0 },
  { label: 'Juan Manuel', value: 1 },
  { label: 'Miguel', value: 2 },
];

const AddressPicker = () => {
  const [showDropDown, setShowDropDown] = React.useState(false);
  const [from, setFrom] = React.useState<number | string>(0);
  const [to, setTo] = React.useState('');

  return (
    <>
      <DropDown
        label='From'
        value={from}
        setValue={(value) => setFrom(value)}
        list={fromList}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        inputProps={{
          dense: true,
        }}
      />
      <TextInput label='To' value={to} onChangeText={(value) => setTo(value)} dense />
    </>
  );
};

export default AddressPicker;
