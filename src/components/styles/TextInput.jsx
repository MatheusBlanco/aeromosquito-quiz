/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';

function TextInput({
  label,
  disabled,
  placeholder,
  containerStyle,
  onTextChange,
  value,
  type,
  inputProps,
}) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...containerStyle }}
    >
      <span>{label}</span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <StyledInput
          placeholder={placeholder}
          onChange={(e) => onTextChange(e.target.value)}
          value={value}
          type={type}
          disabled={disabled === true}
          {...inputProps}
        />
      </div>
    </div>
  );
}

const StyledInput = styled.input`
  background-color: #7cc6fe;
`;

export default TextInput;
