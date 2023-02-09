type Checkbox<T> = {
  value: T;
  onChange: (value: T) => void;
} & Omit<JSX.IntrinsicElements['input'], 'onChange'>;

export const Checkbox = <T extends string>({
  value,
  onChange,
}: Checkbox<T>) => {
  return (
    <div>
      <input
        type="checkbox"
        name={value}
        value={value}
        id={value}
        defaultChecked
        onChange={() => onChange(value)}
      />
      <label htmlFor={value}>{value}</label>
    </div>
  );
};
