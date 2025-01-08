import React from "react";

import "./Snow.scss";

function Snow({image}) {
  return (
    <div>
      {[...Array(200)].map((_, index) => (
        <div key={index} className="snow"></div>
      ))}
      <div className='content'>
    
      </div>
    </div>
  );
}

export default Snow;
