# Motivation
The `slim` package aims at supporting the creation of state machines with the [Kingly state machine library](https://brucou.github.io/documentation/). The Kingly state machine library may hover around a bundle size of 10-15KB. While Kingly is tree-shakeable and in practice the size after tree-shaking is around 5KB, the `slim` compiler allows developers to reduce the footprint of their state machines. This may be worthy if developers are using only a few small machines. We expect that, as the machine grows in complexity (number of control states, and hierarchy depth), the gain in bundle size obtained through the compiler is naturally reduced. We however estimate the effort worthwhile, as developers would likely have to write really large machines to come down to the same size than the library (which includes debugging, tracing, and error management).



With the [yed graph editor](https://www.yworks.com/products/yed-live), [devtool](https://github.com/brucou/yed2Kingly) and the present compiler, we believe the minimal set of pieces is in place for developing and maintaining comfortably large Kingly state machines.

# Guiding principles
- the generated code should be readable by a human
- the generated code should work in as many browsers as possible with a minimum of polyfills
- the generated code should be easy to debug

We thus decided to use `prettifyer`, include comments in the generated code, and avoid arrow functions and other newer JavaScript language features.

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
  
# Examples
There are plenty of graph examples in the [test directory](https://github.com/brucou/slim/tree/master/tests/graphs). An example, extracted from the tests directory and involving compound states and history pseudo-states is as follows:

![example of yed graph with history pseudo-state and compound state](https://imgur.com/VjKaIkL.png)

The compiled machine is below 170 lines of code and the minified compressed size is below 1KB.

# Size of file generated
The size file is mostly proportional to the sum of the number of control states and the number of transitions of the graph. The proportional coefficient seems to be fairly low.


# Tests
Tests are run with [mocha](https://mochajs.org/). Go to the [`tests` directory](https://github.com/brucou/slim/tree/master/tests) and run:

```bash
mcocha *specs*
``` 

# Final note
After using and working with state machine for the past four years, I believe I am reaching a satisfying API and process. The idea is really to avoid unnecessary complexity. I am however interested in hearing your comments, and suggestions together with use cases that you believe are not satisfactorily addressed -> post an issue in the project directory.

