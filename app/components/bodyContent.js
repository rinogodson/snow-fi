"use client";
import React from "react";
import "../styles/page.css";
import Snow from "./Snow";

function BodyContent() {
  const [resData, setResData] = React.useState({cover: "https://r2.ch3n.cc/songs/Jazz%20On%20The%20Moon.png",});
  const [started, setStarted] = React.useState(false);


  const audio = React.useRef();

  // Functions:
  const clickHandler = () => {
    // TODO: Implement clickHandler
    console.log("Clicked");
    setStarted(!started);
    getCurrentSong();
    playSong(resData.url, resData.timestamp);
  };

  function sendHeartBeat() {
    fetch("https://api.ch3n.cc/currentsong/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        resData.viewers = data.viewers;
      });
  }

  function mute() {
    audio.current.muted = !audio.current.muted;
  }
 let progress;
  function playSong(url, timestamp) {
    audio.current.src = url;
    audio.current.currentTime = timestamp;
    audio.current.play();
    setInterval(() => {
      progress = (audio.current.currentTime / audio.current.duration) * 100;
    }, 1000);
  }

  //------------------------------------
// functions:
  function sendHeartBeat() {
    fetch("https://api.ch3n.cc/currentsong/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Date.now().toString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResData((prevData) => {
          return { ...prevData, viewers: data.viewers };
        });
      });
  }

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

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
      clearInterval();

    } catch (error) {
      console.error(error);
    }
  };




  // ------------------------------

  React.useEffect(() => {
    sendHeartBeat();
    try {
      response = fetch("https://api.ch3n.cc/currentsong/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setResData(data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    // Initial fetch
    getCurrentSong();
    console.log("Got Current Song");
    
    const interval = setInterval(getCurrentSong, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);



  React.useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      stopTrackingTime();
    };
  }, []);



  React.useEffect(() => {
    if (started && (audio.current.src !== resData.url || audio.current.currentTime === 0)) {
      playSong(resData.url, resData.timestamp);
    }
    console.log("Playing Song");
    
  }, [resData]);

  return (
    <div>
      <div
        style={{ backgroundImage: `url(${resData.cover})` }}
        className="page"
      >
        <div className="overlay">
          <div className="top">
            <h1 className="logo">S N O W F I</h1>

            <p style={{ color: "#fff" }}>{resData.song}</p>
            <p style={{ fontSize: "28px", color: "rgba(255, 255, 255, 0.65)" }}>
              {resData.artist}
            </p>

            <h1 className="info">{resData.viewers} Frosties Vibin'</h1>
          </div>

          <Snow image={resData.cover} />

          <div className="bottom">
            {!started && <Button onClick={clickHandler} />}
            {started && (
              <div className="controls">
                <button style={{backgroundColor: "rgba(0,0,0,0)"}} onClick={mute} className="button">
                  🔉
                </button>
                <p className="warning">Nice UI Only on Desktop</p>
                <audio ref={audio} />
                <p style={{marginTop: "10px", color: "rgba(255, 255, 255, 0.7)"}}>{formatTime(resData.timestamp)} / {formatTime(resData.duration)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyContent;

function Button({ onClick }) {
  return (
    <button onClick={onClick} className="button">
      Start Vibin'
    </button>
  );
}
