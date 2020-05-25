# Motivation
The `slim` package aims at supporting the creation of state machines with the [Kingly state machine library](https://brucou.github.io/documentation/). The Kingly state machine library may hover around a bundle size of 10-15KB. While Kingly is tree-shakeable and in practice the size after tree-shaking is around 5KB, the `slim` compiler allows developers to reduce the footprint of their state machines. This may be worthy if developers are using only a few small machines. We expect that, as the machine grows in complexity (number of control states, and hierarchy depth), the gain in bundle size obtained through the compiler is naturally reduced. We however estimate the effort worthwhile, as developers would likely have to write really large machines to come down to the same size than the library (which includes debugging, tracing, and error management).  
  
With the [yed graph editor](https://www.yworks.com/products/yed-live), [devtool](https://github.com/brucou/yed2Kingly) and the present compiler, we believe the minimal set of pieces is in place for developing and maintaining comfortably large Kingly state machines.  

# Guiding principles
- the generated code should be readable by a human  
- the generated code should work in as many browsers as possible with a minimum of polyfills  
- the generated code should be easy to debug  
  
We thus decided to use `prettier`, include comments in the generated code, and avoid arrow functions and other newer JavaScript language features.  

# How does it work?
In a typical process, I start designing a machine from the specifications by drawing it in the yEd editor. When I am done or ready to test the results of my design, I save the file. yEd by default saves its files in a `.graphml` format. I save the graphml file in the same directory in which I want to use the created state machine. From there, a previously launched watcher runs the `slim` node script on the newly saved file and generates the compiled JavaScript file which exports the machine factory -- you can of course also run the script manually instead of using a watcher. The provided exports can then be used as parameters to create a Kingly state machine.  

# Install
`npm install slim`

# Usage
```bash
slim file.graphml
```

Running the converter produces two files, targeted at consumption in a browser and node.js environment:

Before:
```bash
src/graphs/file.graphml
```

After:
```bash
src/graphs/file.graphml.fsm.compiled.js
src/graphs/file.graphml.fsm.compiled.cjs
```

The converter must emit an error or exit with an error code if the converted graph will not give rise to a valid Kingly machine (in particular cf. rules). The idea is to fail as early as possible.  
  
The produced file export one factory function which when runs with the right parameters will return a Kingly state machine.  
  
There are plenty of examples of use in the test directory. Let's illustrate the parameters received by the factory function:  

```js
    // require the js file
    const { createStateMachine } = require(`${graphMlFile}.fsm.compiled.cjs`);

    // Build the machine
    const guards = {
      'not(isNumber)': (s, e, stg) => typeof s.n !== 'number',
      isNumber: (s, e, stg) => typeof s.n === 'number',
    };
    const actionFactories = {
      logOther: (s, e, stg) => ({ outputs: [`logOther run on ${s.n}`], updates: {} }),
      logNumber: (s, e, stg) => ({ outputs: [`logNumber run on ${s.n}`], updates: {} }),
    };
    const fsm1 = createStateMachine({
      initialExtendedState: { n: 0 },
      actionFactories,
      guards,
      updateState,
    }, settings);
```

As can be seen from the example, the factory function's first parameter consists of four objects: the initial extended state of the machine; the JavaScript code for the action factories and guards referenced by name in the `.graphml` file;  and a reducer function `updateState` which takes an object and an array of modifications to perform on that object.  
  
Note that the compiled machine does not offer error messages, protection against malformed inputs, devtool or logging functionality. This is only possible when using the Kingly library.  
  
Note also that, as much as possible, we refrain from using advanced JavaScript language features in the code generated by the compiler with a view for that code to be usable in older browsers without polyfilling or babel-parsing. This however has not really been tested so far.  
  
## Rules
Some definitions:  
 - An initial transition is that which originates from a node whose label is `init`  
 - A top-level initial transition is that initial transition which does not have any parent node  
 - A history pseudo-state is a node whose label is H (shallow history) or H* (deep history)  
 - A compound node is a node which is created in the yEd interface by using the group functionality (*Grouping > Group* or *Ctrl-Alt-G* in version 3.19).  
  
- `slim` rules:  
  - The compiler converts the `.graphml` file using the same algorithm than `yed2Kingly`. As such the same conversion rules that apply: the machine encoded in the `.graphml` file must correspond to a valid Kingly machine.  

# Size of file generated
There are plenty of graph examples in the [test directory](https://github.com/brucou/slim/tree/master/tests/graphs). 

The size of the compiled file follows the shape `a + b x Number of transitions`, i.e. is mostly proportional to the number of transitions of the graph. The proportional coefficient `b` seems to be fairly low and the compression factor increases with the size of the machine. In short, you need to write a really large graph to get to 5Kb just for the machine.

We give two data points. Minification is performed online with the [javascript-minifier](https://javascript-minifier.com/) tool. The simple counter machine, which is about the smallest non-trivial machine that can be drawn:

![counter machine graph](./tests/graphs/counter.png)

is compiled (as of Slim 0.6.0) to 37 lines of code, and has a minified compressed size of 500 bytes.

The password meter machine, a slightly more complex but still small example from the [documentation website](https://brucou.github.io/documentation/v1/tutorials/password-meter.html):   

![[password meter modelization]](https://brucou.github.io/documentation/graphs/password-meter.png)

is compiled (as of Slim 0.6.0) to zero-dependency 75 lines of code:

```js
function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var cs = "nok";
  var es = initialExtendedState;

  var eventHandlers = {
    n4ღidle: {
      start: function (es, ed, stg) {
        let computed = actions["display initial screen"](es, ed, stg);
        cs = "n3ღweak";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n3ღweak: {
      typed: function (es, ed, stg) {
        let computed = null;
        if (guards["!letter and numbers?"](es, ed, stg)) {
          computed = actions["display weak password screen"](es, ed, stg);
          cs = "n3ღweak";
        } else if (guards["letter and numbers?"](es, ed, stg)) {
          computed = actions["display strong password screen"](es, ed, stg);
          cs = "n2ღstrong";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    n2ღstrong: {
      typed: function (es, ed, stg) {
        let computed = null;
        if (guards["letter and numbers?"](es, ed, stg)) {
          computed = actions["display strong password screen"](es, ed, stg);
          cs = "n2ღstrong";
        } else if (guards["!letter and numbers?"](es, ed, stg)) {
          computed = actions["display weak password screen"](es, ed, stg);
          cs = "n3ღweak";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
      "clicked submit": function (es, ed, stg) {
        let computed = actions["display password submitted screen"](es, ed, stg);
        cs = "n1ღdone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    nok: {
      init: function (es, ed, stg) {
        cs = "n4ღidle"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
  };

  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      // If transition, but no guards fulfilled => null, else => computed outputs
      return computed === null ? null : computed.outputs;
    }
    // Event is not accepted by the machine
    else return null;
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

export { createStateMachine };

```

with a minified compressed size of 660 bytes. 

Assuming 30 bytes per transitions (computed from those two data points), with a base line of 500 bytes, to reach 5KB we need a machine with 150 transitions!!

Im summary, endowed with the present compiler, **Kingly proposes state machines as a zero-cost abstraction**.

# Tests
Tests are run with [mocha](https://mochajs.org/). Go to the [`tests` directory](https://github.com/brucou/slim/tree/master/tests) and run:  

```bash
mocha *specs*
``` 

# Final note
After using and working with state machine for the past four years, I believe I am reaching a satisfying API and process. The idea is really to avoid unnecessary complexity. I am however interested in hearing your comment, and suggestions together with use cases that you believe are not satisfactorily addressed -> post an issue in the project directory.  
