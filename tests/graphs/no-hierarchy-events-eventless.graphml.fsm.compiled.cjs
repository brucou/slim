// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
//   "shouldReturnToA": function (){},
// };
// -----Actions------
// const actions = {
//   "logAtoB": function (){},
//   "logAtoC": function (){},
//   "logBtoD": function (){},
//   "logCtoD": function (){},
//   "logDtoA": function (){},
// };
// ----------------
var nextEventMap = { n4ღD: "" };

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
        cs = "n1ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    n1ღA: {
      event1: function (s, ed, stg) {
        let computed = actions["logAtoB"](s, ed, stg);
        cs = "n2ღB";
        es = updateState(s, computed.updates);

        return computed;
      },
      event2: function (s, ed, stg) {
        let computed = actions["logAtoC"](s, ed, stg);
        cs = "n3ღC";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    n2ღB: {
      event2: function (s, ed, stg) {
        let computed = actions["logBtoD"](s, ed, stg);
        cs = "n4ღD";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    n3ღC: {
      event1: function (s, ed, stg) {
        let computed = actions["logCtoD"](s, ed, stg);
        cs = "n4ღD";
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    n4ღD: {
      "": function (s, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](s, ed, stg)) {
          computed = actions["logDtoA"](s, ed, stg);
          cs = "n1ღA";
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

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
      return computed === null
        ? // If transition, but no guards fulfilled => null, else
          null
        : nextEventMap[cs] == null
        ? computed.outputs
        : // Run automatic transition if any
          computed.outputs.concat(process({ [nextEventMap[cs]]: eventData }));
    }
    // Event is not accepted by the machine
    else return null;
  }

  // Start the machine
  process({ ["init"]: initialExtendedState });

  return process;
}

module.exports = {
  createStateMachine,
};
