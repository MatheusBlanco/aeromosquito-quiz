/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { Oval } from 'react-loader-spinner';

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
          color="#ffffff"
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
  font-size: 16px;
  color: #ffffff;
  background-color: #34471f;
  border-radius: 5px;
  padding: 5px;
  border: 2px solid #34471f;
  cursor: pointer;

  &:disabled {
    background-color: #34471f;
    border: 2px solid #34471f;
  }
`;
