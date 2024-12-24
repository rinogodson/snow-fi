import React from "react";

import "./Snow.scss";

function Snow({image}) {
  return (
    <div>
      {[...Array(200)].map((_, index) => (
        <div key={index} className="snow"></div>
      ))}
      <div className='content'>
    <img className='cover' src={image} alt='Album Cover' style={{ width: '200px', height: '200px', borderRadius: '10px' }} />
      </div>
    </div>
  );
}

export default Snow;
