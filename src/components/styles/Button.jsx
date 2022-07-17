/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function Button({ loading, disabled, onClick, ...props }) {
  return (
    <StyledButton
      {...props}
      type="button"
      disabled={loading ? true : disabled}
      onClick={loading ? () => {} : onClick}
    />
  );
}

const StyledButton = styled.button`
  width: 100%;
  font-size: 16px;
  color: #ffffff;
  background-color: #252d4a;
  border-radius: 15px;
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  border: 5px solid #234668;
  cursor: pointer;
`;
