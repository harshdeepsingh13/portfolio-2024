import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalContextProvider from "./context/GlobalContextProvider";
import {BrowserRouter} from "react-router-dom";

import ReactGA from "react-ga4";

ReactGA.initialize(process.env.REACT_APP_GA4_MEASUREMENT_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalContextProvider>
                <App/>
            </GlobalContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
