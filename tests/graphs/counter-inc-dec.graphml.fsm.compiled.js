// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
// };
// -----Actions------
// const actions = {
//   "increment counter, render": function (){},
//   "decrement counter, render": function (){},
// };
// ----------------

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var cs = "nok";
  var es = initialExtendedState;

  var eventHandlers = {
    nok: {
      init: function (s, ed, stg) {
        cs = "n1ღidle"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    n1ღidle: {
      "click inc": function (s, ed, stg) {
        let computed = actions["increment counter, render"](s, ed, stg);
        cs = "n1ღidle";
        es = updateState(s, computed.updates);

        return computed;
      },
      "click dec": function (s, ed, stg) {
        let computed = actions["decrement counter, render"](s, ed, stg);
        cs = "n1ღidle";
        es = updateState(s, computed.updates);

        return computed;
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
