'use strict';

requirejs.config({
  baseUrl: '',
  paths: {
    app: '../app',
    jobs: '../jobs',
    src: '../src',
    text: 'text'
  },
  text: {
    useXhr: function(url, protocol, hostname, port) {
      return true;
    }
  }
});

requirejs(['testsite/main']);
