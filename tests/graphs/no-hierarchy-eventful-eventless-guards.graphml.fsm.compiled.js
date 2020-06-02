// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
//   "condition1": function (){},
//   "condition2": function (){},
//   "condition3": function (){},
//   "shouldReturnToA": function (){},
// };
// -----Actions------
// const actions = {
//   "logAtoTemp1": function (){},
//   "logAtoTemp2": function (){},
//   "logAtoDone": function (){},
//   "logTemp1toA": function (){},
//   "logTemp2toA": function (){},
// };
// ----------------
var nextEventMap = { n2ღTemp1: "", n3ღTemp2: "", n4ღDone: "" };

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
      init: function (es, ed, stg) {
        cs = "n1ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    n1ღA: {
      event: function (es, ed, stg) {
        let computed = null;
        if (guards["condition1"](es, ed, stg)) {
          computed = actions["logAtoTemp1"](es, ed, stg);
          cs = "n2ღTemp1";
        } else if (guards["condition2"](es, ed, stg)) {
          computed = actions["logAtoTemp2"](es, ed, stg);
          cs = "n3ღTemp2";
        } else if (guards["condition3"](es, ed, stg)) {
          computed = actions["logAtoDone"](es, ed, stg);
          cs = "n4ღDone";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    n2ღTemp1: {
      "": function (es, ed, stg) {
        let computed = actions["logTemp1toA"](es, ed, stg);
        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n3ღTemp2: {
      "": function (es, ed, stg) {
        let computed = actions["logTemp2toA"](es, ed, stg);
        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n4ღDone: {
      "": function (es, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](es, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n1ღA";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
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

export { createStateMachine };
