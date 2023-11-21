

import React from 'react';

const Popup = ({ onReloadSession }) => {
  return (
    <div className="bgpopup">
    <div className="popup">
      <div className="popup-content">
      <p>Your session will timeout soon. Do you want to reload?</p>
      <button onClick={onReloadSession}>Reload</button>
      </div>
    </div>
    </div>
  );
};

export default Popup;
