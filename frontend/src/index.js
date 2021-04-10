import React from "react";
import ReactDOM from 'react-dom';
import Routes from "./routes";

function App() {
  return (
    <div className="App">
        <Routes />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));