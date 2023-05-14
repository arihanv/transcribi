import React from 'react'
import Tab from 'react-bootstrap/Tab';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import "./GPT.css"
import Chat from './Chat';

function GPT(props) {
  return (
    <div className="bg-gray-800 border-4 border-gray-700 rounded-xl">
    {/* <div className="sticky top-0 pl-4 mb-1 text-lg font-semibold text-left bg-black backdrop-blur-sm">
      Summary
    </div> */}
    <div className="pr-2.5 pl-2.5 text-base">
    <Tabs
  variant="pills"   
  defaultActiveKey="Chat"
  id="uncontrolled-tab-example"
  className="mt-2 mb-3 bg-black rounded-xl"
>
  <Tab eventKey="Chat" title="Chat">
    {
        props.loaded == false && props.indexed == true ? (<Chat transcript={props.transcript} />) : (<div className="text-center p-3.5 font-semibold flex flex-col justify-center">Generating Transcript and Indexing</div>)
    }
  </Tab>
</Tabs>
    </div>
  </div>
  )
}

export default GPT