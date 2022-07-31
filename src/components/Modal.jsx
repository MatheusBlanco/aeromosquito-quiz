/* eslint-disable consistent-return */
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const Modal = ({
  show,
  onClose,
  onGoBack,
  middleChild,
  title,
  children,
  rightHeaderContents,
  justify,
  height,
  hasGoBack,
  modalHeight,
  modalWidth,
  headerPadding,
  contentType,
  marginTop,
  isBackgroundBlurred,
}) =>
  ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <StyledModal onClick={onClose} isBackgroundBlurred={isBackgroundBlurred}>
        <StyledContent
          modalHeight={modalHeight}
          modalWidth={modalWidth}
          onClick={(e) => e.stopPropagation()}
        >
          <StyledHeader headerPadding={headerPadding}>
            {hasGoBack && (
              <StyledGoBack onClick={onGoBack} type="button">
                <span style={{ marginLeft: 6 }}>voltar</span>
              </StyledGoBack>
            )}
            <StyledRightContents>{rightHeaderContents}</StyledRightContents>
          </StyledHeader>
          <HeaderContents marginTop={marginTop}>{title}</HeaderContents>
          <MiddleContents>{middleChild}</MiddleContents>
          <StyledBody
            height={height}
            justify={justify}
            contentType={contentType}
          >
            {children}
          </StyledBody>
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
  background-color: ${({ isBackgroundBlurred }) =>
    isBackgroundBlurred ? '' : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: ${({ isBackgroundBlurred }) =>
    isBackgroundBlurred ? 'blur(2px)' : ''};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
`;

const StyledContent = styled.div`
  padding: 25px;
  border-radius: 15px;
  background-color: #729b46;
  width: ${({ modalWidth }) => (modalWidth ? `${modalWidth}px` : '892px')};
  height: ${({ modalHeight }) => (modalHeight ? `${modalHeight}px` : '')};
`;

const StyledHeader = styled.div`
  padding: ${({ headerPadding }) =>
    headerPadding ? `${headerPadding}px` : '10px'};
  display: flex;
  justify-content: space-between;
`;

const HeaderContents = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : '-30px')};
  margin-bottom: -20px;
`;

const MiddleContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-right: 15px;
  margin-top: 35px;
  margin-bottom: 27px;
`;

const StyledBody = styled.div`
  max-height: ${({ height }) => (height ? `${height}px` : '589px')};
  overflow-y: auto;
  overflow-x: hidden;
  @media screen and (max-height: 800px) {
    max-height: ${({ height }) => (height ? `${height}px` : '450px')};
    margin-top: ${({ contentType }) =>
      contentType === 'comments' ? '60px' : ''};
  }

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
  margin-bottom: 35px;
  border: none;
  background-color: transparent;
  color: #729b46;
  cursor: pointer;
  z-index: 1;
`;

const StyledRightContents = styled.div`
  margin-bottom: 35px;
  color: #729b46;
  cursor: default;
`;

export default Modal;
