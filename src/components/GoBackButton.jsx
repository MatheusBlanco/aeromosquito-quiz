import React from 'react';
import styled from 'styled-components';
import { ReactComponent as ArrowLeft } from '../assets/images/ArrowLeft.svg';

export function GOBackButton({ onClickFunc }) {
  return (
    <StyledButton
      onClick={onClickFunc}
      type="button"
      style={{ maxWidth: '40px' }}
    >
      <ArrowLeft />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-green);
  border-radius: 10px;
  padding: 5px;
  border: 2px solid var(--dark-green);
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
