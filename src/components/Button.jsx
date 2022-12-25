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
  background-color: var(--dark-green);
  border-radius: 5px;
  padding: 5px;
  border: 2px solid var(--dark-green);
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
