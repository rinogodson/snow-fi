'use client'
import React from 'react'
import '../styles/page.css'
import Snow from './Snow'

function BodyContent() {
  const [resData, setResData] = React.useState({
    cover: 'https://r2.ch3n.cc/songs/Jazz%20On%20The%20Moon.png'
  });



  React.useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const response = await fetch("https://api.ch3n.cc/currentsong/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setResData(data);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentSong();
  }, []);

  return (
    <div style={{ backgroundImage: `url(${resData.cover})` }} className='page'>
      <div className='overlay'>
        <Snow image={resData.cover} />
      </div>
    </div>
  );
}

export default BodyContent;