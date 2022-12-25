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
      {!noMatchInfo && <StyledHeader>Partida {match?.cod}</StyledHeader>}
      {match?.groups
        .sort((a, b) => b.score - a.score)
        .map((group, index) => {
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
              return <GoldMedal />;
            }
            if (currentGroup?.score < otherGroup?.score) {
              return <SilverMedal />;
            }
            if (currentGroup?.score === otherGroup?.score) {
              return <GoldMedal />;
            }
          };
          return (
            <div key={group?.groupId}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Pontos time {group?.groupName}
                </span>
                {handleMedalRender()}
              </div>
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
