/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdArrowDropDown } from 'react-icons/md';

function Select({
  options,
  onOptionClick,
  defaultOptionIndex,
  selectedOption,
  defaultPlaceholder,
  selectstyle,
  discreet,
  complex,
  width,
}) {
  const [isOpen, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);
  const divRef = useRef();

  const handleOptionClick = (option, name, index) => {
    if (isOpen) {
      setOpen(false);
      onOptionClick(option, index);
      if (complex) {
        setPlaceholder(name);
      } else {
        setPlaceholder(option);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (defaultOptionIndex !== undefined) {
      setPlaceholder(options[defaultOptionIndex]);
    } else if (selectedOption !== undefined) {
      setPlaceholder(selectedOption);
    }
  }, [divRef]);

  const handleOpen = () => {
    if (isOpen) {
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return false;
  };

  useEffect(() => {
    handleOpen();
  }, [isOpen]);
  return (
    <div
      style={{
        width: width || '30%',
        ...selectstyle,
      }}
      ref={divRef}
    >
      <div>
        <StyledSelect
          type="button"
          discreet={discreet}
          onClick={() => setOpen(!isOpen)}
        >
          {placeholder ? (
            <span
              style={{
                fontWeight: 'bold',
                marginRight: 'auto',
                maxWidth: '95%',
              }}
            >
              {placeholder}
            </span>
          ) : (
            <span
              style={{
                marginRight: 'auto',
                paddingRight: 5,
              }}
            >
              {defaultPlaceholder}
            </span>
          )}
          <MdArrowDropDown />
        </StyledSelect>
      </div>

      {isOpen && (
        <StyledInputDiv
          isOpen={isOpen}
          discreet={discreet}
          width={divRef.current.clientWidth}
        >
          {options?.map((option, index) => (
            <StyledOption
              key={index}
              discreet={discreet}
              onClick={() => {
                if (complex) {
                  handleOptionClick(
                    option?.cod || option?.id,
                    option?.groupName || option?.cod || option?.answer,
                    index
                  );
                } else {
                  handleOptionClick(option, false, index);
                }
              }}
            >
              {complex
                ? option?.groupName || option?.cod || option?.answer
                : option}
            </StyledOption>
          ))}
        </StyledInputDiv>
      )}
    </div>
  );
}

const StyledSelect = styled.button`
  width: 100%;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-green);
  border-radius: 5px;
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  border: 5px solid var(--dark-green);
  cursor: pointer;
`;

const StyledInputDiv = styled.div`
  border-radius: 0px 0px 5px 5px;
  margin-top: -5px;
  padding-top: 10px;

  background-color: var(--dark-green);
  position: absolute;
  width: ${({ width }) => width}px;
  max-height: 300px;
  z-index: 50;
  overflow-y: auto;
  overflow-x: hidden;

  -webkit-box-shadow: 0px 5px 6px -1px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 5px 6px -1px rgba(0, 0, 0, 0.25);

  ::-webkit-scrollbar {
    width: 6px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    width: 4px;
    background: #e3e3e4;
  }
`;

const StyledOption = styled.div`
  width: 100%;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-green);
  display: flex;
  padding: 5px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: var(--secondary-green);
    border-color: var(--secondary-green);
  }
`;

export default Select;
