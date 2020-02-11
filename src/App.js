import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import routes from "./routes"

class App extends Component {
  
  constructor(props) {
    super(props) 
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
        <Switch>
          { Object.keys(routes.routes).map((name,k) => <Route key={k} path={`/${name}`} component={routes.routes[name].component} />) }
          <Redirect to={`/${routes.default}`}/>
        </Switch>
    );
  }

}

export default withRouter(App);
