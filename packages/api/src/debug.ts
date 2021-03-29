import debug from 'debug';

const debuggers = {
  http: debug('http'),
  error: debug('error'),
};

// HTTP and error debug is enabled by default
if (!process.env.DEBUG) {
  debug.enable('http,error');
}

export default debuggers;
