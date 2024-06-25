import React, { useEffect } from "react";
import dashjs from "dashjs";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  useEffect(() => {
    let url = API_URL + "/stream-video/";
    let player = dashjs.MediaPlayer().create();
    player.initialize(document.querySelector("#videoPlayer"), url, true);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>On Demand Video Streaming Project</p>
        <video id="videoPlayer" controls></video>
      </header>
    </div>
  );
}

export default App;
