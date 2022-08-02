/* eslint-disable consistent-return */
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const Modal = ({ show, onClose, onGoBack, title, children }) =>
  ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <StyledModal onClick={onClose}>
        <StyledContent onClick={(e) => e.stopPropagation()}>
          <StyledHeader>
            <StyledGoBack onClick={onGoBack} type="button">
              <span>X</span>
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
  background-color: #729b46;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 25px;
  padding-top: 25px;
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
    background: #532791;
    width: 6px;
    border-radius: 10px;
  }
`;

const StyledGoBack = styled.button`
  border: none;
  background-color: transparent;
  color: #729b46;
  cursor: pointer;
  z-index: 1;
`;

export default Modal;
