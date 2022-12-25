import React from 'react';
import ProgressBar from './ProgressBar';
import { StyledHeader } from './Texts';

export default function GroupPoints({ match }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {' '}
      <StyledHeader>Partida {match?.cod}</StyledHeader>
      {match?.groups
        .sort((a, b) => b.score - a.score)
        .map((group) => {
          const groupPointsPercentage =
            (group.score / match.questionLength) * 100;
          return (
            <div key={group?.groupId}>
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                Pontos time {group?.groupName}
              </span>
              <ProgressBar
                bgcolor="var(--dark-green)"
                completed={groupPointsPercentage}
              />
            </div>
          );
        })}
    </div>
  );
}
