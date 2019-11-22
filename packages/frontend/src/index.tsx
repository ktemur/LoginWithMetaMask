import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { config as dotEnvConfig } from 'dotenv';

import './index.css';
import { App } from './App';

dotEnvConfig({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development'
});

ReactDOM.render(<App />, document.getElementById('root'));
