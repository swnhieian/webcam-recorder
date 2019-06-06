import React from 'react';
import Recorder from './Recorder';
import UserInterface from './UserInterface';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// -------------------------- Firebase ------------------------- //

 
function Index() {
  return <h2>Home</h2>;
}

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <div>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/webcams">WebCams</Link></li>
                <li><Link to="/user">UserInterface</Link></li>
              </ul>
            </nav>
          </div>
          <Route path="/" exact component={Index} />
          <Route path="/webcams" component={Recorder} />
          <Route path="/user" component={UserInterface} />
        </Router>
      </div>
    );
  };
}

export default App;
