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

module.exports = {
  createStateMachine,
};
