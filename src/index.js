import React from 'react';
import ReactDom from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App';

if (module.hot) {
    module.hot.accept(() => {
      ReactDom.render(
          <AppContainer>
              <App />
          </AppContainer>,
          document.getElementById('root')
      )
    })
  }
  
  ReactDom.render(
      <AppContainer>
          <App />
      </AppContainer>,
      document.getElementById('root')
  )
