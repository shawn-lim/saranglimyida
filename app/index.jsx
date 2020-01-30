import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import "../node_modules/font-awesome/css/font-awesome.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "!style-loader!css-loader!sass-loader!./index.scss";

import Home from './components/Home';
import Bali from './components/Bali';
import Admin from './components/Admin';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/bali" exact component={Bali}></Route>
          <Route path="/restricted" exact component={Admin}></Route>
          <Route component={function(){
            return (
              <div className="container">
                <h1>404</h1>
                <p>The page you are looking for cannot be found.</p>
              </div>
            )
          }}></Route>
      </Switch>
    </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App></App>,
  document.getElementById('app')
);
