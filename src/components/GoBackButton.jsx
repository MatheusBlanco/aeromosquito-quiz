import React from 'react';
import styled from 'styled-components';
import { ReactComponent as ArrowLeft } from '../assets/images/ArrowLeft.svg';

export function GOBackButton({ onClickFunc }) {
  return (
    <StyledButton
      onClick={() => {
        localStorage.removeItem('color');
        onClickFunc();
      }}
      type="button"
      color={
        localStorage.getItem('color') ? localStorage.getItem('color') : 'green'
      }
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
  background-color: var(--dark-${({ color }) => color});
  border-radius: 10px;
  padding: 5px;
  border: 2px solid var(--dark-${({ color }) => color});
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: var(--secondary-${({ color }) => color});
    border: 2px solid var(--secondary-${({ color }) => color});
  }
`;
