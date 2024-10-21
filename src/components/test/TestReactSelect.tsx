import { useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
  <label style={{ marginRight: '1em' }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

function Basic() {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={options[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="color"
        options={options}
      />

      <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
        <Checkbox checked={isClearable} onChange={() => setIsClearable((state) => !state)}>
          Clearable
        </Checkbox>
        <Checkbox checked={isSearchable} onChange={() => setIsSearchable((state) => !state)}>
          Searchable
        </Checkbox>
        <Checkbox checked={isDisabled} onChange={() => setIsDisabled((state) => !state)}>
          Disabled
        </Checkbox>
        <Checkbox checked={isLoading} onChange={() => setIsLoading((state) => !state)}>
          Loading
        </Checkbox>
        <Checkbox checked={isRtl} onChange={() => setIsRtl((state) => !state)}>
          RTL
        </Checkbox>
      </div>
    </>
  );
}

function Async() {
  const filterColors = (inputValue: string) => {
    return options.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  };

  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
  };

  return <AsyncSelect cacheOptions loadOptions={loadOptions} defaultOptions />;
}

function MassiveItemsByAsync() {
  const loadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    setTimeout(() => {
      callback(Array.from({ length: 1000 }, (_, i) => ({ value: i.toString(), label: i.toString() })));
    }, 1000);
  };

  return <AsyncSelect cacheOptions loadOptions={loadOptions} defaultOptions />;
}

export function TestReactSelect() {
  return (
    <div>
      <h3>Basic</h3>
      <Basic />
      <h3>Async</h3>
      <Async />
      <h3>Massive Items by Async</h3>
      <MassiveItemsByAsync />
    </div>
  );
}
