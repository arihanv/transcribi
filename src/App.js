import { Button, Card, Text } from "@nextui-org/react";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import testgrap from "./v2.png";

function App() {

  return (
    <div className="App">
      <header className="flex items-center justify-center App-header">
        <div className="hero">
          <div className="grid gap-5 text-white">
            <h1 className="text-7xl font-[650]"><i className="pl-2 pr-2 gradHighlight backdrop-blur-lg">Transform</i> audio into insights</h1>
            <p className="text-2xl font-normal leading-tight">
              Get accurate transcriptions and valuable sentiment, summary, and
              analysis.
            </p>
            <button
              onClick={() => (window.location.href = "#/home")}
              className="clickBut p-2.5  text-white font-semibold gradHighlight"
            >
              Get Started
            </button>
          </div>
          <div className="flex justify-center">
            {/* <div className="items-center inline-block w-1/2 h-full text-white bg-black border-black rounded-3xl"> */}
            <div className="items-center inline-block h-full homeImg">
              <img
              src={testgrap}
                // src="https://i.imgur.com/5Az0TLo.png"
                className="max-w-[350px]"
                alt="Logo"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;