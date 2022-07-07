import React, { useState } from 'react';
import styled from 'styled-components';
import { MainWindow } from '../components/styles/MainWindow';
import TextInput from '../components/styles/TextInput';
import { StyledHeader } from '../components/styles/Texts';

function LogAsGroup() {
  const [groupName, setGroupName] = useState('');
  const [groupColor, setGroupColor] = useState('');

  console.log(groupName);
  return (
    <MainWindow>
      <StyledHeader>lol</StyledHeader>
      <TextInput
        label="Nome do Grupo"
        value={groupName}
        onTextChange={(value) => setGroupName(value)}
        type="text"
      />
    </MainWindow>
  );
}

export default LogAsGroup;
