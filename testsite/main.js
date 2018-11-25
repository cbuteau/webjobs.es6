'use strict';

  import TroubleMaker from '../src/TroubleMaker.js';

  // var requireScriptNode = document.querySelector('#require');
  // var requireScriptUrl = requireScriptNode.src;
  // console.log(requireScriptUrl);

  TroubleMaker.setup({});

  var addButton = document.querySelector('#simple_execButton');

  var param1 = document.querySelector('#simple_param1');
  var param2 = document.querySelector('#simple_param2');
  var paramOp = document.querySelector('#simple_paramop');

  var resultDom = document.querySelector('#simple_result');

  addButton.addEventListener('click', function(e) {
    var prom = TroubleMaker.start({
      jobPath: '../jobs/AdditionJob.js',
      jobparams: {
        param1: parseInt(param1.value),
        param2: parseInt(param2.value),
        op: paramOp.value
      }
    });

    prom.then(function(result) {
      resultDom.innerHTML = result.toString();
    }).catch(function(e) {
      console.error(e);
    });
  });

  var reExecButton = document.querySelector('#recurse_execButton');
  var reParamOne = document.querySelector('#recurse_param1');
  var reresultDom = document.querySelector('#recurse_result');

  reExecButton.addEventListener('click', function(e) {
    var prom = TroubleMaker.start({
      jobPath: 'jobs/RecursiveJob',
      jobparams: {
        n: parseInt(reParamOne.value),
      }
    });

    prom.then(function(result) {
      reresultDom.innerHTML = result.toString();
    }).catch(function(e) {
      console.error(e);
    });
  });

  var wsApiParam = document.querySelector('#timez_apiparam');
  var wsExecButton = document.querySelector('#ws_execButton');
  var wsresultDom = document.querySelector('#ws_result');

  wsExecButton.addEventListener('click', function(e) {
    var url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + wsApiParam.value + '&format=json&by=zone&zone=America/New_York';
    var prom = TroubleMaker.start({
      jobPath: 'jobs/GenericWebServiceJob',
      jobparams: {
        url: url,
        verb: 'GET'
      }
    });

    prom.then(function(result) {
      wsresultDom.innerHTML = JSON.stringify(result, null, '  '); // result.toString();
    }).catch(function(e) {
      console.error(e);
    });
  });


  var multiApiParam = document.querySelector('#multi_apiparam');
  var multiExecButton = document.querySelector('#multi_listButton');

  var multiZoneList = document.querySelector('#multi_paramlist');

  var multiGetButton = document.querySelector('#multi_getButton');
  var multiGetResult = document.querySelector('#multi_result');

  // perform list then perrform get on selected from list.
  multiExecButton.addEventListener('click', function(e) {
    var url = 'http://api.timezonedb.com/v2.1/list-time-zone?key=' + multiApiParam.value + '&format=json';
    var prom = TroubleMaker.start({
      jobPath: 'jobs/GenericWebServiceJob',
      jobparams: {
        url: url,
        verb: 'GET'
      }
    });

    prom.then(function(result) {
      console.log(result);
      var zoneNames = [];
      for (var i = 0; i < result.zones.length; i++) {
        var currentZone = result.zones[i];
        zoneNames.push(currentZone.zoneName);
      }
      zoneNames.sort(function(a, b) {
        return a.localeCompare(b, 'en');
      });

      for (var j = 0; j < zoneNames.length; j++) {
        var opt = document.createElement('option');
        opt.textContent = zoneNames[j];
        opt.value = zoneNames[j];
        multiZoneList.appendChild(opt);
      }

      //wsresultDom.innerHTML = JSON.stringify(result, null, '  '); // result.toString();
    }).catch(function(e) {
      console.error(e);
    });
  });


  multiGetButton.addEventListener('click', function(e) {
    var url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + multiApiParam.value + '&format=json&by=zone&zone=' + multiZoneList.value;
    var prom = TroubleMaker.start({
      jobPath: 'jobs/GenericWebServiceJob',
      jobparams: {
        url: url,
        verb: 'GET'
      }
    });

    prom.then(function(result) {
      multiGetResult.innerHTML = JSON.stringify(result, null, '  '); // result.toString();
    }).catch(function(e) {
      console.error(e);
    });
  });
