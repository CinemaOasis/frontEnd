import React from 'react';
import MoviesList from './components/MovieList';

function App() {
  return (
    <div className="App">
      <MoviesList />
    </div>
  );
}

export default App;




/*import React from 'react';

import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

//export default App;

/*
function App() {
  const sampleMovie = {
    title: "El padrino",
    //poster: "/path/to/poster.jpg",
    summary: "La envejecida patriarca de una dinastía del crimen organizado decide transferir su posición de comando a su reacio hijo."
  }

  return (
    <div>
      <Navbar />
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
        <MovieCard movie={sampleMovie} />
      </div>
      <Button text="Haz click aquí" onClick={() => alert("Hola")} />
    </div>
  );
} */

//export default App;*/
