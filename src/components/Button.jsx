/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Oval } from 'react-loader-spinner';
import styled from 'styled-components';

export default function Button({
  loading,
  disabled,
  onClick,
  child,
  ...props
}) {
  return (
    <StyledButton
      {...props}
      type="button"
      color={
        localStorage.getItem('color') ? localStorage.getItem('color') : 'green'
      }
      disabled={loading ? true : disabled}
      onClick={loading ? () => {} : onClick}
    >
      {!loading ? (
        child
      ) : (
        <Oval
          height="30"
          width="30"
          radius="48"
          color="var(--white)"
          ariaLabel="watch-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible
        />
      )}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 150px;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-${({ color }) => color});
  border-radius: 5px;
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
