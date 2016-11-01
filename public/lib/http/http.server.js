'use strict';

import axios from 'axios';
import config from 'config';

var instance = axios.create({
  baseURL: config.get('be.host'),
  timeout: 10000,
  headers: {'version': config.get('clientVersion')},
});

export default instance;
