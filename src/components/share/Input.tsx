import React, { ChangeEvent } from "react";

interface Props {
  name: string;
  type: string;
  placeholder: string;
  value: string | number;
  label: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  name,
  type,
  placeholder,
  value,
  label,
  onchange,
}: Props) => {
  return (
    <>
      <label>{label}</label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onchange}
      />
    </>
  );
};
