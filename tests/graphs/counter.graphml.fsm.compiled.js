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
        cs = "n1ღidle"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    n1ღidle: {
      click: function (es, ed, stg) {
        let computed = actions["increment counter, render"](es, ed, stg);
        cs = "n1ღidle";
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