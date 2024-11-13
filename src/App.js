import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { httpClient } from './HttpClient';

import Keycloak from 'keycloak-js';

/*
  Init Options
*/
let initOptions = {
  url: 'http://localhost:8080/',
  realm: 'viettel-cloud',
  clientId: 'account-console',
}

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: 'check-sso', // Supported values: 'check-sso' , 'login-required'
  checkLoginIframe: true,
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    // window.location.reload();
  } else {
    /* Remove below logs if you are using this on production */
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    /* http client will use this header in every request it sends */
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  /* Notify the user if necessary */
  console.error("Authentication Failed");
});

function App() {

  const [infoMessage] = useState('');

  /* To demonstrate : http client adds the access token to the Authorization header */

  return (
    <div className="App">
      <div className='grid'>
        <div className='col-12'>
          <h1>HUB SME</h1>
        </div>
      </div>
      <div className="grid">

      </div>

      <div className='grid'>
        <div className='col-1'></div>
        <div className='col-2'>
          <div className="col">
            <Button onClick={() => {
              kc.login({
                idpHint: 'sme',
                redirectUri: 'http://localhost:8080/realms/viettel-cloud/account'
              })
            }}
              className='m-1 custom-btn-style'
              label='Viettel Cloud'
              severity="success" />

          </div>
        </div>
        <div className='col-6'>

          <Card>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </Card>
        </div>

        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App;
