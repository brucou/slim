var nextEventMap = { n1ღA: null, "n2ღGroup 1": "init", "n2::n0ღB": null, "n2::n2ღC": null };

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state
  var stateAncestors = { "n2::n0ღB": ["n2ღGroup 1"], "n2::n2ღC": ["n2ღGroup 1"] };
  var cs = "nok";
  var es = initialExtendedState;

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        cs = "n1ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n2ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = actions["logAtoB"](es, ed, stg);
          cs = "n2::n0ღB";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = actions["logAtoC"](es, ed, stg);
          cs = "n2::n2ღC";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }

        return computed;
      },
    },
    n1ღA: {
      event1: function (es, ed, stg) {
        cs = "n2ღGroup 1"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
  };

  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = [cs].concat(stateAncestors[cs] || []).find(function (controlState) {
      return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
    });

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
