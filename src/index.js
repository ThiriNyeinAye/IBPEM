import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppComponent from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom"

const App = props => (
    <BrowserRouter forceRefresh={false}>
        <AppComponent />
    </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
