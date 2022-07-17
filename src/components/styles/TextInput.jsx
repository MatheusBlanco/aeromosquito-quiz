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
      <span style={{ margin: 5 }}>{label}</span>

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
  width: 100%;
  font-size: 16px;
  color: #ffffff;
  background-color: #234668;
  border-radius: 15px;
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  border: 5px solid #234668;
  cursor: pointer;
`;

export default TextInput;
