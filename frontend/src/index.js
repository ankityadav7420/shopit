import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
// import {positions, transitions,Provider as Alertprovider} from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'
  // import 'react-toastify/dist/ReactToastify.css';
// const options={
//   timeout:5000,
//   positions:positions.TOP_RIGHT,
//   transitions:transitions.SCALE
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      {/* //TO DO: add error or notification template */}
        <App />
  </Provider>
);

reportWebVitals();
