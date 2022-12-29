/* eslint-disable consistent-return */
import React from 'react';
import { ReactComponent as GoldMedal } from '../assets/images/gold-medal-svgrepo-com.svg';
import { ReactComponent as SilverMedal } from '../assets/images/silver-medal-svgrepo-com.svg';

import ProgressBar from './ProgressBar';
import { StyledHeader } from './Texts';

export default function GroupPoints({ match, noMatchInfo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {' '}
      {!noMatchInfo && (
        <>
          <StyledHeader style={{ fontSize: '14px' }}>
            Partida: {match?.cod}
          </StyledHeader>
          <StyledHeader style={{ fontSize: '14px' }}>
            Tema: {match?.theme}
          </StyledHeader>
        </>
      )}{' '}
      <span style={{ fontSize: 20, fontWeight: 'bold' }}>Pontuação:</span>
      {match?.groups
        .sort((a, b) => b.score - a.score)
        .map((group) => {
          const groupPointsPercentage =
            (group.score / match.questionLength) * 100;
          const currentGroup = match.groups.find(
            (g) => g.groupId === group.groupId
          );
          const otherGroup = match.groups.find(
            (g) => g.groupId !== group.groupId
          );

          const handleMedalRender = () => {
            if (currentGroup?.score > otherGroup?.score) {
              return (
                <div style={{ minWidth: '20px' }}>
                  <GoldMedal />
                </div>
              );
            }
            if (currentGroup?.score < otherGroup?.score) {
              return (
                <div style={{ minWidth: '20px' }}>
                  <SilverMedal />
                </div>
              );
            }
            if (currentGroup?.score === otherGroup?.score) {
              return (
                <div style={{ minWidth: '20px' }}>
                  <GoldMedal />
                </div>
              );
            }
          };
          return (
            <div key={group?.groupId}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {group?.groupName}
                </span>
                {handleMedalRender()}
              </div>
              <ProgressBar
                bgcolor={
                  localStorage.getItem('color')
                    ? `var(--dark-${localStorage.getItem('color')})`
                    : `var(--dark-green)`
                }
                completed={groupPointsPercentage}
              />
            </div>
          );
        })}
    </div>
  );
}
