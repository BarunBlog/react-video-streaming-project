import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>On Demand Video Streaming Project</p>

        <video controls>
          <source
            src="http://127.0.0.1:8000/stream/stream-video/"
            type="video/mp4"
          ></source>
        </video>
      </header>
    </div>
  );
}

export default App;
