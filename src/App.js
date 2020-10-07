import React, { Component } from 'react'
import './stylesheets/App.scss'
import DataTable from './components/DataTable'

class App extends Component {

  render() {
    return (
      <div className="App container">
        <DataTable />
      </div>
    );
  }
}

export default App