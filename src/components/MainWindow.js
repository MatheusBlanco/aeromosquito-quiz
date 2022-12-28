import styled from 'styled-components';

export const MainWindow = styled.div`
  background-color: var(--primary-${({ color }) => color});
  border-radius: 15px;
  padding: 20px;
  width: calc(device-width/2);
  box-shadow: 10px 10px 42px 0px rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 70vw;
  max-height: 70vh;

  ::-webkit-scrollbar {
    width: 6px;
    margin-left: 10px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    width: 4px;
    background: var(--secondary-${({ color }) => color});
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--dark-${({ color }) => color});
    width: 6px;
    border-radius: 10px;
  }
`;
