/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
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
  tooltip,
  tooltipMessage,
}) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...containerStyle }}
    >
      <span
        style={{
          margin: 5,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        {label}{' '}
        {tooltip ? (
          <StyledButton>
            <AiOutlineQuestionCircle id={tooltipMessage} />
            <Tooltip
              anchorId={tooltipMessage}
              content={tooltipMessage}
              place="top"
            />
          </StyledButton>
        ) : (
          ''
        )}
      </span>

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

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-green);
  border-radius: 30px;
  padding: 2px;
  border: 2px solid var(--dark-green);
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default TextInput;
