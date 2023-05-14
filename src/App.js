import { Button, Card, Text } from "@nextui-org/react";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import testgrap from "./v2.png";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="App">
      <header className="flex items-center justify-center App-header">
        <div className="hero">
          <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton className="text-white bg-gray-800 !border-black back">
              <Modal.Title className="pl-2 pr-2 !text-xl !font-semibold bg-gray-700 rounded-xl">Upload File</Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex items-center justify-center text-white bg-gray-800">
              <Form.Group controlId="formFile">
                <Form.Control type="file" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="text-white !bg-gray-800 !border-black">
              <Button className="!min-w-fit"  onClick={() => (window.location.href = "#/home")}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="grid gap-3 text-white">
            <h1 className="text-7xl font-[650]">
              <i className="pl-2 pr-2 gradHighlight backdrop-blur-lg">
                Transform
              </i>{" "}
              audio into insights
            </h1>
            <p className="text-2xl font-normal leading-tight">
              Get accurate transcriptions and valuable analysis.
            </p>
            <button
              // onClick={() => (window.location.href = "#/home")}
              onClick={handleShow}
              className="clickBut p-2.5  text-white font-semibold gradHighlight"
            >
              Get Started
            </button>
          </div>
          <div className="flex justify-center">
            <div className="items-center inline-block h-full homeImg">
              <img src={testgrap} className="max-w-[350px]" alt="Logo" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
