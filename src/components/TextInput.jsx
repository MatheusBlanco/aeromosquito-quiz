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
  wrongData,
  wrongDataMessage,
}) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...containerStyle }}
    >
      <span style={{ margin: 5, fontWeight: 'bold' }}>{label}</span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
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
        {wrongData === true ? (
          <span
            style={{ alignSelf: 'flex-start', marginTop: 4, color: '#A82E2E' }}
          >
            {wrongDataMessage}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const StyledInput = styled.input`
  width: 100%;
  font-size: 16px;
  color: #ffffff;
  background-color: transparent;
  outline: 0;
  border-width: 0 0 2px;
  border-color: #34471f;
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  &:focus {
    border-color: #5d7740;
  }
`;

export default TextInput;
