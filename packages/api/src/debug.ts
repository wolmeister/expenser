import debug from 'debug';

const debuggers = {
  http: debug('http'),
};

// HTTP Debug is enabled by default
if (!process.env.DEBUG) {
  debug.enable('http');
}

export default debuggers;
