var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;

require("../node_modules/font-awesome/css/font-awesome.css");
require("../node_modules/bootstrap/dist/css/bootstrap.css");
require("!style-loader!css-loader!sass-loader!./index.scss");

var Home = require('./components/Home');

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route component={function(){
            return (
              <div className="container">
                <h1>404</h1>
                <p>The page you are looking for cannot be found.</p>
              </div>
            )
          }}></Route>
      </Switch>
    </Router>
    );
  }
}

ReactDOM.render(
  <App></App>,
  document.getElementById('app')
);
