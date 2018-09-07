/*jslint es6 */
'use strict';

console.log('loading...');

import {TroubleMaker} from './src/TroubleMaker.js'

class WebjobsApp {
  constructor() {
    this.paramOne = document.getElementById('param1');
    this.paramTwo = document.getElementById('param2');

    this.addButton = document.getElementById('add');
    var self = this;
    this.addButton.addEventListener('click', function() {
      TroubleMaker.start({
        jobPath: 'jobs/AdditionJob.js',
        jobParams: {
          param1: self.paramOne.value,
          param2: self.paramTwo.value
        }
      })
    });
  }
}

window.addEventListener('load', () => new WebjobsApp());

//document.registerElement('webjobes-note', WebjobsApp);
