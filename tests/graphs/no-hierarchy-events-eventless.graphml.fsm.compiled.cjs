var nextEventMap = { n1ღA: null, n2ღB: null, n3ღC: null, n4ღD: "" };

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
      event1: function (es, ed, stg) {
        let computed = actions["logAtoB"](es, ed, stg);
        cs = "n2ღB";
        es = updateState(es, computed.updates);

        return computed;
      },
      event2: function (es, ed, stg) {
        let computed = actions["logAtoC"](es, ed, stg);
        cs = "n3ღC";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n2ღB: {
      event2: function (es, ed, stg) {
        let computed = actions["logBtoD"](es, ed, stg);
        cs = "n4ღD";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n3ღC: {
      event1: function (es, ed, stg) {
        let computed = actions["logCtoD"](es, ed, stg);
        cs = "n4ღD";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n4ღD: {
      "": function (es, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](es, ed, stg)) {
          computed = actions["logDtoA"](es, ed, stg);
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
        : nextEventMap[cs] === null
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
