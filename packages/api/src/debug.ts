import debug from 'debug';
import { getEnv } from './env';

const debuggers = {
  http: debug('http'),
  error: debug('error'),
};

// HTTP and error debug is enabled by default
if (!getEnv('DEBUG')) {
  debug.enable('http,error');
}

export default debuggers;
