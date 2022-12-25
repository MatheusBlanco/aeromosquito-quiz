import React from 'react';

function ProgressBar({ bgcolor, completed }) {
  const containerStyles = {
    height: 20,
    minWidth: '200px',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 50,
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
