# webjobs.es6
ES6 version of webjobs concept

## Badges

<!-- ### Coveralls

[![Coverage Status](https://coveralls.io/repos/github/cbuteau/typetools/badge.svg)](https://coveralls.io/github/cbuteau/typetools) -->

### Circle CI Build

[![CircleCI](https://circleci.com/gh/cbuteau/webjobs.es6.svg?style=svg)](https://circleci.com/gh/cbuteau/webjobs.es6)

### npm Version

[![npm version](http://img.shields.io/npm/v/webjobs.es6.svg?style=flat)](https://npmjs.org/package/webjobs.es6 "View this project on npm")


### npm big badge

[![NPM](https://nodei.co/npm/webjobs.es6.png)](https://nodei.co/npm/webjobs.es6/)



## Dispatching

The main key to managing a thread was devising a protocol to initialize, start, and complete work.

Each message is an int because I prefer int compares to string compares for efficiency.



## Concept

The idea is to make it easy to submit jobs to a managed threadpool.
Both client and thread base structureshave to exist.

But the end result would be queueing work and using a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to then or catch the result.

```javascript
  function exec() {
    var that = this;
    job = TroubleMaker.start({
      jobpath: 'src/ParsingJob.js'
    });
    job.then(function(result) {
      that._updateResult(result.toString());
    }).catch(function(e) {
      console.error(e);
      that.dispatchEvent('JobFailed');
    });
  }
```
## Drives

Although threads are a not new are for browsers.  They have not reached an are where they are commonly used.
It is noted there is a sharp spin up times for these threads.

Only a messaging/event system works between Main and the threads...so it will be the goal to manage and recycle them reinitializing them.

## Design

Most of the design came from the ES5 version which was developed primarily off a test server in the browser.

Sequence

This describes the sequence of messages for a thread to initialize.  to load requirejs.  to load a JOB requirejs module. and then instantiate and call the dispatch method of the object.

![Sequence](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/cbuteau/webjobs.es6/master/uml/sequence.puml)


<!-- ![Sequence](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsye-4i-KWVLtM9wbUzvPWTUReZzTksdD5Udzkv15l4Qzd-UpSicN0THfXB3g7Q4kYffnetzb2HWt2vOeay4kOeXntky3Mopy0) -->

Some enums that matter

![Enums](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/cbuteau/webjobs.es6/master/uml/enums.puml)

<!-- ![Enums](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsyu-4i-ISz7LUdr2zxct1wamTZzTfVUIEzF4yo2lU8bvN-PmyicN0-pJ2MFfKwIs9chBGlhE5Q0t2vOu4bXhb-fyRRB_z0G00) -->


And a state machine describing how a thread is managed.

![Enums](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/cbuteau/webjobs.es6/master/uml/states.puml)

<!-- ![State](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsye-4i-MSz7LP7rEzxct1wipH7w_JjEUEzFuyo2lU8bxlyZbvPCk0wpJ2M7GEqPP4JRdHlhE5Z1g4oufaZKIKwvzki7tv0m00) -->

## Discovered through Implementation.

+ Web Workers or threads in the web browser world.
+ Run in a separate thread.
+ Can share no memory with the main thread.
+ Exchanges data using a Message Queue. (postMessage)
+ have a spin up time.

From these discoveries I found I should implement a THreadPooling and restarting mechanism.

The idea was to get the thread up and running and through messages tell it to reinitialize and load a new job to execute.
