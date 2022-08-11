/* eslint-disable consistent-return */
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

const Modal = ({ show, onClose, onGoBack, title, children }) =>
  ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <StyledModal onClick={onClose}>
        <StyledContent onClick={(e) => e.stopPropagation()}>
          <StyledHeader>
            <StyledGoBack onClick={onGoBack} type="button">
              <MdClose />
            </StyledGoBack>
          </StyledHeader>
          <HeaderContents>{title}</HeaderContents>
          <StyledBody>{children}</StyledBody>
        </StyledContent>
      </StyledModal>
    </CSSTransition>,
    document.getElementById('root')
  );

const StyledModal = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledContent = styled.div`
  border-radius: 15px;
  background-color: var(--primary-green);
  padding: 25px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderContents = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 25px;
  padding-right: 25px;
`;

const StyledBody = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 500px;

  ::-webkit-scrollbar {
    width: 6px;
    margin-left: 10px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    width: 4px;
    background: var(--secondary-green);
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--dark-green);
    width: 6px;
    border-radius: 10px;
  }
`;

const StyledGoBack = styled.button`
  border: none;
  background-color: var(--dark-red);
  width: 30px;
  height: 30px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 5px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background-color: var(--dark-red);
  }
`;

export default Modal;
