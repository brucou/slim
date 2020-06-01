// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
//   "isNumber": function (){},
//   "not(isNumber)": function (){},
// };
// -----Actions------
// const actions = {
//   "logNumber": function (){},
//   "logOther": function (){},
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
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n0ღNumber";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = { outputs: [], updates: [] };
          cs = "n2ღOther";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    n0ღNumber: {
      continue: function (es, ed, stg) {
        let computed = actions["logNumber"](es, ed, stg);
        cs = "n3ღDone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n2ღOther: {
      continue: function (es, ed, stg) {
        let computed = actions["logOther"](es, ed, stg);
        cs = "n3ღDone";
        es = updateState(es, computed.updates);

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
