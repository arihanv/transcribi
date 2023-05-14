import React, { useState, useEffect } from "react";
import { Loading } from "@nextui-org/react";
import axios from "axios";
import GPT from "./GPT";

function Analysis(props) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(null);
  const [script, setScript] = useState(null);
  const [indexed, setIndexed] = useState(false);
  useEffect(() => {
    var ws = new WebSocket("ws://localhost:8000/wst");
    ws.onopen = function () {
      console.log("WebSocket Client Connected");
    };
    ws.onmessage = function (e) {
      const { chunk, segment } = JSON.parse(e.data);
      console.log(segment);
      if (segment === "Done") {
        console.log(messages);
        props.setLoaded(true);
        setLoading(false);
      } else if (segment === "Loading") {
        setLoading(true);
      } else {
        props.setTranscript((prevTranscript) => {
          let updatedTranscript = [...prevTranscript];
          segment.forEach((element) => {
            const isDuplicate = updatedTranscript.some(
              (item) => JSON.stringify(item) === JSON.stringify(element)
            );

            if (!isDuplicate) {
              updatedTranscript = updatedTranscript.concat(element);
            }
          });
          return updatedTranscript;
        });

        setMessages((prevMessages) => [...prevMessages, chunk]);
      }
    };
    ws.onerror = function (err) {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      ws.close();
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  function appendText(data) {
    let sentence = "";
    data.forEach((element) => {
      sentence += element["text"];
    });
    return sentence;
  }

  useEffect(() => {
    setScript(appendText(props.transcript));
    if (props.transcript != null && props.transcript.length > 0) {
      const transcript = appendText(props.transcript);
      axios
        .post("http://localhost:8000/index", { message:"message", transcript })
        .then((res) => {
          console.log(res.data);
          setIndexed(true);
        })
        .catch((error) => {
          console.error(error.request);
        });
    }
  }, [loading]);

  return (
    <div className="infoBox rounded-xl grid gap-4 h-[40rem]">
      <div className="overflow-scroll bg-gray-800 border-4 border-gray-700 rounded-xl">
        <div className="sticky top-0 flex flex-row gap-3 pl-4 mb-1 text-lg font-semibold text-left bg-black backdrop-blur">
          <div>Full Transcript</div>
          <div className="flex items-center">
            {loading != null && (
              <>
                {loading ? (
                  <div className="text-yellow-800 bg-yellow-200 smBox">
                    <div className="flex flex-row gap-1">
                      Loading
                      <Loading size="xs" type="spinner" />
                    </div>
                  </div>
                ) : (
                  <div className="text-green-800 bg-green-200 smBox">
                    <div className="flex flex-row gap-1">Done</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="pr-2.5 pl-2.5 text-base gap-3 grid">
          {messages.map((sentence, i) => (
            <div
              onClick={() =>
                props.waveform.current.setCurrentTime(sentence.start)
              }
              className="p-2.5 rounded-xl cursor-pointer hover:bg-gray-700"
              style={{
                backgroundColor:
                  props.currentTime >= sentence.start &&
                  props.currentTime <= sentence.end &&
                  "black",
              }}
            >
              <div className="font-bold timePill">
                {sentence.start.toFixed(2)} - {sentence.end.toFixed(2)}
              </div>

              <div key={i} className="text-base" contenteditable="true">
                {sentence["sentence"].map((line, i) => (
                  <span key={i} className="text-base">
                    {line}{" "}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <GPT loaded={loading} transcript={script} indexed={indexed}></GPT>
    </div>
  );
}

export default Analysis;
