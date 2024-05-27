import React, { Component, Fragment } from 'react';
import 'semantic-ui-css/semantic.min.css';
import MainApp from "./SwitchApp/MainApp";

class App extends Component {

  state = {};

  render() {
    return (
        <Fragment>
          <MainApp/>
        </Fragment>
    );
  }
}

export default App;
