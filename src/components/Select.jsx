/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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
                  handleOptionClick(option?.id, option.groupName, index);
                } else {
                  handleOptionClick(option, false, index);
                }
              }}
            >
              {complex ? option?.groupName : option}
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

const StyledInputDiv = styled.div`
  border-radius: 0px 0px 5px 5px;
  margin-top: -5px;
  padding-top: 10px;
  padding-bottom: 15px;

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
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ discreet }) =>
      discreet ? 'var(--primary-purple-0)' : 'var(--secondary-purple-3)'};
    width: 6px;
    border-radius: 10px;
  }
`;

const StyledOption = styled.div`
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

export default Select;
