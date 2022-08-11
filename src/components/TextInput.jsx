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
            style={{
              alignSelf: 'flex-start',
              marginTop: 4,
              color: 'var(--dark-red)',
            }}
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
  color: var(--white);
  background-color: transparent;
  outline: 0;
  border-width: 0 0 2px;
  border-color: var(--dark-green);
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  &:focus {
    border-color: var(--dark-green);
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: var(--dark-green);
    opacity: 1; /* Firefox */
  }
`;

export default TextInput;
