import Wavesurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import audio from "./audio.wav";
import {
  PlayBtnFill,
  PlayCircleFill,
  SkipEndBtnFill,
  SkipStartBtnFill,
  StopCircleFill,
} from "react-bootstrap-icons";

const Waveform = ({ url, time }) => {
  const waveform = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if wavesurfer object is already created.
    if (!waveform.current) {
      // Create a wavesurfer object
      // More info about options here https://wavesurfer-js.org/docs/options.html
      waveform.current = Wavesurfer.create({
        container: "#waveform",
        waveColor: "#567FFF",
        barGap: 2,
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 3,
        cursorColor: "#567FFF",
      });
      // Load audio from a remote url.
      waveform.current.load(audio);
      // Set the duration when the audio is ready
      waveform.current.on("ready", () => {
        setDuration(waveform.current.getDuration());
      });
    }
  }, []);

  const playAudio = () => {
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
      setIsPlaying(false);
    } else {
      waveform.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (waveform.current) {
      waveform.current.on("seek", () => {
        console.log("seek");
        setCurrentTime(waveform.current.getCurrentTime());
      });

      waveform.current.on("finish", () => {
        console.log("finish");
        setIsPlaying(false);
        waveform.current.setCurrentTime(0);
      });
    }
  }, [waveform.current]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (waveform.current && waveform.current.isPlaying()) {
        setCurrentTime(waveform.current.getCurrentTime());
        time(waveform.current.getCurrentTime());
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  function skipBack() {
    if (currentTime - 5 < 0) {
      return 0;
    }
    return currentTime - 5;
  }

  return (
    <div className="audioPlayer">
      <div className="flex flex-row justify-center items-center gap-2">
      <button onClick={() => waveform.current.setCurrentTime(skipBack())}>
          <SkipStartBtnFill size={30} />
        </button>
        <button
          className="flex justify-center rounded-[100%]"
          onClick={playAudio}
        >
          {isPlaying ? (
            <StopCircleFill size={50} />
          ) : (
            <PlayCircleFill size={50} />
          )}
        </button>
        <button
          onClick={() => waveform.current.setCurrentTime(currentTime + 5)}
        >
          <SkipEndBtnFill size={30} />
        </button>
      </div>

      <div className="grid gap-2">
        <div id="waveform" />
        <div className="flex justify-between">
          <div className="text-base bg-black rounded-xl pl-2 pr-2">
            {currentTime.toFixed(2)}
          </div>
          <div className="text-base  bg-black rounded-xl pl-2 pr-2">
            {duration.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waveform;
