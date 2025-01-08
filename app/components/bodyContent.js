"use client";
import React, { useRef, useEffect, useState } from "react";
import "../styles/page.css";
import ElasticSlider from "@/src/blocks/Components/ElasticSlider/ElasticSlider";

import { motion, AnimatePresence } from "framer-motion";
import Snowfall from "react-snowfall";
import { Volume1, Volume2, Bolt, CircleX } from "lucide-react";

import Noise from "@/src/blocks/Animations/Noise/Noise";

const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isPhone;
};

function BodyContent() {
  const containerRef = useRef(null);

  const enterFullScreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if (containerRef.current.webkitRequestFullscreen) {
      containerRef.current.webkitRequestFullscreen(); // Safari
    } else if (containerRef.current.msRequestFullscreen) {
      containerRef.current.msRequestFullscreen(); // IE/Edge
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Safari
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen(); // IE/Edge
    }
  };

  const [resData, setResData] = useState({
    cover: "https://r2.ch3n.cc/songs/Jazz%20On%20The%20Moon.png",
    artist: "Rino Godson",
    song: "Jazz On The Moon",
    viewers: 0,
    url: "",
    timestamp: 0,
    duration: 0,
  });
  const isPhone = useIsPhone();
  console.log(isPhone);
  
  const [next, setNext] = useState({ song: "", artist: "" });
  const [started, setStarted] = useState(false);

  const audio = useRef(null);

  const [volume, setVolume] = useState(1);
  if (audio.current) {
    audio.current.volume = volume;
  }
  const [snowProps, setSnowProps] = useState({
    radius: 0.5,
    snowflakeCount: 60,
    speed: [0.5, 1],
    wind: [-0.8, 0.5],
    showNoise: false,
    showCard: false,
    showSnow: true,

    patternSize: 250,
    patternScale: 2.5,
    patternAlpha: 15,
  });

  const handleSettingsBt = () => {
    setSnowProps({ ...snowProps, showCard: !snowProps.showCard });
  };
  const clickHandler = () => {
    setStarted(true);
    playSong(resData.url, resData.timestamp);
  };

  const sendHeartBeat = () => {
    fetch("https://api.ch3n.cc/currentsong/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now().toString() }),
    })
      .then((response) => response.json())
      .then((data) =>
        setResData((prev) => ({ ...prev, viewers: data.viewers }))
      )
      .catch((err) => console.error("Heartbeat error:", err));
  };

  const getCurrentSong = async () => {
    try {
      const [currentResponse, nextResponse] = await Promise.all([
        fetch("https://api.ch3n.cc/currentsong/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("https://api.ch3n.cc/currentsong/nextsong", {
          method: "GET",
        }),
      ]);

      const currentData = await currentResponse.json();
      const nextData = await nextResponse.json();

      setResData(currentData);
      setNext(nextData);
    } catch (error) {
      console.error("Error fetching song data:", error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const playSong = (url, timestamp) => {
    if (audio.current) {
      audio.current.src = url;
      audio.current.currentTime = timestamp;
      audio.current
        .play()
        .catch((err) => console.error("Audio playback error:", err));
    }
  };

  const updateProgress = () => {
    if (audio.current) {
      setResData((prev) => ({
        ...prev,
        timestamp: audio.current.currentTime,
      }));
    }
  };

  useEffect(() => {
    getCurrentSong();
    const songInterval = setInterval(getCurrentSong, 10000);
    const heartbeatInterval = setInterval(sendHeartBeat, 30000);
    const progressInterval = setInterval(updateProgress, 600);

    return () => {
      clearInterval(songInterval);
      clearInterval(heartbeatInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (started && audio.current?.src !== resData.url) {
      playSong(resData.url, resData.timestamp);
    }
  }, [resData, started]);

  return (
    <AnimatePresence>
      <div ref={containerRef} onClick={()=>{
        if(isPhone){
          enterFullScreen();
        }
      }}>
        {snowProps.showCard && <SettingsCard snowProps={snowProps} setSnowProps={setSnowProps} />}
        {snowProps.showNoise && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <Noise
              patternSize={snowProps.patternSize}
              patternScaleX={snowProps.patternScale}
              patternScaleY={snowProps.patternScale}
              patternRefreshInterval={2}
              patternAlpha={snowProps.patternAlpha}
            />
          </div>
        )}
        {snowProps.showSnow && (
          <div
            style={{
              height: "100vh",
              width: "100vw",
              position: "absolute",
              overflow: "hidden",
              pointerEvents: "none",
              filter: "blur(1px)",
            }}
          >
            <Snowfall
              radius={[snowProps.radius, snowProps.radius]}
              snowflakeCount={snowProps.snowflakeCount}
              speed={snowProps.speed}
              wind={snowProps.wind}
            />
          </div>
        )}

        <div
          style={{ backgroundImage: `url(${resData.cover})` }}
          className="page"
        >
          <div className="overlay">
            <div className="top">
              <h1 className="logo">
                S N O W F I
                <button onClick={handleSettingsBt} className="settings">
                  {!snowProps.showCard ? (
                    <Bolt size={"18px"} />
                  ) : (
                    <CircleX size={"18px"} />
                  )}
                  {!snowProps.showCard ? "Settings" : "Close"}
                </button>
              </h1>
              <p
                style={{ color: "rgba(255, 255, 255, 0.76)" }}
                className="song"
              >
                {resData.song}
              </p>
              <p
                style={{ color: "rgba(255, 255, 255, 0.52)", fontSize: "18px" }}
                className="artist"
              >
                {resData.artist.replace(/\//g, " • ")}
              </p>
              <p
                style={{ color: "rgba(255, 255, 255, 0.33)", fontSize: "12px" }}
                className="next-song"
              >
                Next: {next.song} by {next.artist}
              </p>
              <h1 className="info">{resData.viewers} Frosties Vibin'</h1>
            </div>

            <div className="imageCont">
              <img
                className="cover"
                src={resData.cover}
                alt="Album Cover"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "20px",
                }}
              />
            </div>

            <div className="bottom">
              {!started && resData.url ? (
                <Button onClick={clickHandler} />
              ) : (
                <div className="controls">
                  <ElasticSlider
                    leftIcon={<Volume1 color="rgba(255, 255, 255, 0.7)" />}
                    rightIcon={<Volume2 color="rgba(255, 255, 255, 0.7)" />}
                    startingValue={0}
                    defaultValue={100}
                    maxValue={100}
                    isStepped
                    stepSize={10}
                    volume={volume}
                    setVolume={setVolume}
                  />

                  <audio ref={audio} />
                  <p style={{ marginBlock: "10px" }} className="time">
                    {formatTime(resData.timestamp)}/
                    {formatTime(resData.duration)}
                  </p>

                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      background: `linear-gradient(to right, white ${
                        (resData.timestamp / resData.duration) * 100
                      }%, rgba(0, 0, 0, 0.3) ${
                        (resData.timestamp / resData.duration) * 100
                      }%)`,
                    }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="progress"
                  ></motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
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

function SettingsCard({ snowProps, setSnowProps }) {
  return (
    <>
      <div className="settings-cont">
        <motion.div
          initial={{ opacity: 0, translateY: "-50px" }}
          animate={{ opacity: 1, translateY: "0px" }}
          exit={{ opacity: 0, translateY: "50px" }}
          className="settingsCard"
        >
          <h3 style={{ textDecoration: "underline" }}>Settings</h3>
          <div className="sectCont">
            <div className="snowSettings settingsSect">
              <div className="toggle" style={{backgroundColor: snowProps.showSnow ? "#fff" : "#000", color: snowProps.showSnow ? "#000" : "#fff"}} onClick={()=>setSnowProps({...snowProps, showSnow: !snowProps.showSnow})}>Toggle<br></br>Snow</div>

              <div style={{opacity: snowProps.showSnow ? 1 : 0.5, pointerEvents: snowProps.showSnow ? "all" : "none", transform: snowProps.showSnow ? "scale(1)" : "scale(0.9)", display:"flex", flexDirection:"column", gap:"20px"}}>
                <div>
                <label className="settingsInputLabel">Radius</label>
                <input type="number" value={snowProps.radius} onChange={(e)=>setSnowProps({...snowProps, radius: (parseFloat(e.target.value)<0.25||parseFloat(e.target.value)>10 ? 0.25 : parseFloat(e.target.value))})} className="settingsInput"/>
                </div>

                <div>
                <label className="settingsInputLabel">Speed</label>
                <input type="number" value={snowProps.speed[1]} onChange={(e)=>setSnowProps({...snowProps, speed: [0.5, (parseFloat(e.target.value)<0.25||parseFloat(e.target.value)>10 ? 0.25 : parseFloat(e.target.value))]})} className="settingsInput"/>
                </div>

                <div>
                <label className="settingsInputLabel">Count: {snowProps.snowflakeCount}</label>
                <input type="range" value={snowProps.snowflakeCount} onChange={(e)=>setSnowProps({...snowProps, snowflakeCount: (parseFloat(e.target.value)==NaN||parseFloat(e.target.value)>100 ? 0 : parseFloat(e.target.value))})} style={{backgroundColor: "#49494989"}} className="settingsInput"/>
                </div>
              </div>

            </div>
            <div className="noiseSettings settingsSect">
              <div className="toggle" style={{backgroundColor: snowProps.showNoise ? "#fff" : "#000", color: snowProps.showNoise ? "#000" : "#fff"}} onClick={()=>setSnowProps({...snowProps, showNoise: !snowProps.showNoise})}>Toggle<br></br>Noise</div>

              <div style={{opacity: snowProps.showNoise ? 1 : 0.5, pointerEvents: snowProps.showNoise ? "all" : "none", transform: snowProps.showNoise ? "scale(1)" : "scale(0.9)", display:"flex", flexDirection:"column", gap:"20px"}}>

                <div>
                <label className="settingsInputLabel">Scale</label>
                <input type="number" value={snowProps.patternScale} onChange={(e)=>setSnowProps({...snowProps, patternScale: (parseFloat(e.target.value)<1||parseFloat(e.target.value)>10 ? 1 : parseFloat(e.target.value))})} className="settingsInput"/>
                </div>

                <div>
                <label className="settingsInputLabel">Alpha: {snowProps.patternAlpha}</label>
                <input type="range" min={5} max={25} value={snowProps.patternAlpha} onChange={(e)=>setSnowProps({...snowProps, patternAlpha: (parseFloat(e.target.value)==NaN||parseFloat(e.target.value)>25 ? 0 : parseFloat(e.target.value))})} style={{backgroundColor: "#49494989"}} className="settingsInput"/>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
