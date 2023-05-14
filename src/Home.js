import Wavesurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import audio from "./audio.wav";
import Analysis from "./Analysis.js";
import {
  PlayCircleFill,
  SkipEndBtnFill,
  SkipStartBtnFill,
  StopCircleFill,
} from "react-bootstrap-icons";

function Home() {
  const waveform = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if wavesurfer object is already created.
    if (!waveform.current) {
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

  function appendText(data) {
    let sentence = '';
    data.forEach((element) => {
      sentence += element['text'];
    }
    )
    return sentence;
  }

  useEffect(() => {
    console.log(appendText(transcript))
  
  }, [loaded])


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

  const [sentences, setSentences] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [currentSentence, setCurrentSentence] = useState(null);

  function getSentence() {
    console.log(transcript)
    for (let i = 0; i < transcript.length; i++) {
      if (
        transcript[i].start <= currentTime &&
        transcript[i].end >= currentTime
      ) {
        // return transcript[i].sentence.join("");
        return i;
      }
    }
    return null;
  }

  useEffect(() => {
    console.log(transcript[getSentence()]);
    if (getSentence() === 0 || getSentence() !== undefined) {
      setCurrentSentence(getSentence());
    }
    // console.log(currentSentence);
  }, [currentTime]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="tranBox rounded-xl border-4 border-gray-700 w-full h-[100%] text-white gap-6 bg-black">
          <div className="audioGrid grid gap-5 max-h-[40rem] h-fit">
            <div className="bg-gray-800 border-4 border-gray-700 rounded-xl">
              <div className="sticky top-0 pl-4 mb-1 text-lg font-semibold text-left bg-black rounded-tr-xl rounded-tl-xl backdrop-blur-sm">
                Audio
              </div>
              <div className="audioPlayer">
                {duration ? (
                  <>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          waveform.current.setCurrentTime(skipBack())
                        }
                      >
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
                        onClick={() =>
                          waveform.current.setCurrentTime(currentTime + 5)
                        }
                      >
                        <SkipEndBtnFill size={30} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="load">Loading</div>
                )}

                <div className="grid gap-2">
                  <div id="waveform" />
                  {duration ? (
                    <div className="flex justify-between">
                      <div className="pl-2 pr-2 text-base bg-black rounded-xl">
                        {currentTime.toFixed(2)}
                      </div>
                      <div className="pl-2 pr-2 text-base bg-black rounded-xl">
                        {duration.toFixed(2)}
                      </div>
                    </div>
                  ) : (<></>)}
                </div>
              </div>
              {/* <Track url="/Users/arihanvaranasi/Dev/React_Dev/aesthetic/chunk_0.mp3" time={setTime()} /> */}
            </div>
            <div className="bg-gray-800 border-4 border-gray-700 rounded-xl">
              <div className="sticky top-0 pl-4 mb-1 text-lg font-semibold text-left bg-black rounded-tr-xl rounded-tl-xl backdrop-blur-sm">
                Current Words
              </div>
              <div>
                {currentSentence !== null ? (
                  // <>{currentSentence}</>
                  <div className="text-start p-3.5 font-bold flex flex-col gap-2">
                    {currentSentence > 0 ? (
                      <div className="text-base font-semibold text-gray-500">
                        {transcript[currentSentence - 1].text}
                      </div>
                    ) : (
                      <div className="invisible text-base font-semibold text-gray-500">
                        {"Prev Text"}
                      </div>
                    )}
                    <div className="text-3xl">
                      {transcript[currentSentence].text}
                    </div>
                    {currentSentence < transcript.length-1 ? (
                      <div className="text-base font-semibold text-gray-500">
                        {transcript[currentSentence + 1].text}
                      </div>
                    ) : (
                      <div className="invisible text-base font-semibold text-gray-500">
                        {"Next Text"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-3.5 font-semibold flex flex-col gap-2 text-xl">
                    Transcript has not been generated for this section yet!
                  </div>
                )}
              </div>
            </div>
          </div>
          <Analysis sentences={sentences} waveform={waveform} currentTime={currentTime} setTranscript={setTranscript} transcript={transcript} setLoaded={setLoaded} />
          {/* <div className="infoBox rounded-xl grid gap-5 h-[40rem]">
            <div className="overflow-scroll bg-gray-800 border-4 border-gray-700 rounded-xl">
              <div className="sticky top-0 pl-4 mb-1 text-lg font-semibold text-left bg-black backdrop-blur-sm">
                Full Transcript
              </div>
              <div className="pr-2.5 pl-2.5 text-base gap-3 grid">
                {sentences.map((sentence, i) => (
                  <div
                    onClick={() => waveform.current.setCurrentTime(sentence.start)}
                    className="p-2.5 rounded-xl cursor-pointer hover:bg-gray-700"
                    style={{
                      backgroundColor:
                        currentTime >= sentence.start &&
                        currentTime <= sentence.end &&
                        "black",
                    }}
                  >
                    <div className="font-bold timePill">
                      {sentence.start.toFixed(2)} - {sentence.end.toFixed(2)}
                    </div>

                    <div key={i} className="text-base" contenteditable="true">
                      {sentence.sentence.map((sentence, i) => (
                        <span key={i} className="text-base">
                          {sentence}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-scroll bg-gray-800 border-4 border-gray-700 rounded-xl">
              <div className="sticky top-0 pl-4 mb-1 text-lg font-semibold text-left bg-black backdrop-blur-sm">
                Summary
              </div>
              <div className="pr-2.5 pl-2.5 text-base">
                Hello my name is Arihan Varnadore and I am a student at the
              </div>
            </div>
          </div> */}
        </div>
      </header>
    </div>
  );
}

export default Home;
