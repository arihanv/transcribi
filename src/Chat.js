import React, { useEffect, useState } from "react";
import { Robot, Send } from "react-bootstrap-icons";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import "./Chat.css";

function Chat(props) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  useEffect(() => {
    if (props.transcript.length > 0) {
      console.log(props.transcript);
    }
  }, [props.transcript]);

  function makeRequest() {
    console.warn("Making request");
    const transcript = props.transcript
    if(message == "") return
    axios
      .post("http://localhost:8000/analyze", { message, transcript })
      .then((res) => {
        setMessage("");
        console.log(res.data);
        setResponse(res.data);
      })
      .catch((error) => {
        console.error(error.request);
      });
  }

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2 max-h-[300px]">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Talk to GPT"
          value={message}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              // Check for the enter key code
              makeRequest();
            }
          }}
          onSubmit={() => makeRequest()}
          onChange={handleChange}
          className="!bg-gray-900 !border-gray-800 !text-white"
          aria-label="Dollar amount (with dot and two decimal places)"
        />
        <InputGroup.Text
          className="!bg-gray-900 !border-gray-800 !text-gray-500 cursor-pointer"
          onClick={() => makeRequest()}
        >
          <Send></Send>
        </InputGroup.Text>
      </InputGroup>
      {response != "" && (
        <div className="h-full p-2 overflow-scroll bg-gray-700 border-gray-800 rounded-lg">
          {response}
        </div>
      )}
    </div>
  );
}

export default Chat;
