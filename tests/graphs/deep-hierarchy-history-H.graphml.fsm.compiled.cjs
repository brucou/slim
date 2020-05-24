var nextEventMap = {
  n1ღE: "",
  "n2ღGroup 1": "init",
  "n2::n0ღB": null,
  "n2::n1ღC": "",
  "n2::n2ღGroup 1": "init",
  "n2::n2::n0ღD": null,
  "n2::n2::n2ღD": null,
};

function updateHistoryState(history, stateAncestors, state_from_name) {
  if (state_from_name === "nok") {
    return history;
  } else {
    var ancestors = stateAncestors[state_from_name] || [];
    ancestors.reduce((oldAncestor, newAncestor) => {
      // set the exited state in the history of all ancestors
      history["deep"][newAncestor] = state_from_name;
      history["shallow"][newAncestor] = oldAncestor;

      return newAncestor;
    }, state_from_name);

    return history;
  }
}

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var stateAncestors = {
    "n2::n0ღB": ["n2ღGroup 1"],
    "n2::n1ღC": ["n2ღGroup 1"],
    "n2::n2ღGroup 1": ["n2ღGroup 1"],
    "n2::n2::n0ღD": ["n2::n2ღGroup 1", "n2ღGroup 1"],
    "n2::n2::n2ღD": ["n2::n2ღGroup 1", "n2ღGroup 1"],
  };
  var cs = "nok";
  var es = initialExtendedState;
  var hs = {
    deep: {
      n1ღE: "",
      "n2ღGroup 1": "",
      "n2::n0ღB": "",
      "n2::n1ღC": "",
      "n2::n2ღGroup 1": "",
      "n2::n2::n0ღD": "",
      "n2::n2::n2ღD": "",
    },
    shallow: {
      n1ღE: "",
      "n2ღGroup 1": "",
      "n2::n0ღB": "",
      "n2::n1ღC": "",
      "n2::n2ღGroup 1": "",
      "n2::n2::n0ღD": "",
      "n2::n2::n2ღD": "",
    },
  };

  var eventHandlers = {
    "n2ღGroup 1": {
      event3: function (es, ed, stg) {
        let computed = actions["logGroup1toH"](es, ed, stg);
        cs = "n1ღE";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
      init: function (es, ed, stg) {
        let computed = actions["logGroup1toC"](es, ed, stg);
        cs = "n2::n1ღC";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    n1ღE: {
      "": function (es, ed, stg) {
        cs = hs["shallow"]["n2ღGroup 1"]; // No action, only cs changes!
        hs = updateHistoryState(hs, stateAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    nok: {
      init: function (es, ed, stg) {
        cs = "n2::n0ღB"; // No action, only cs changes!
        hs = updateHistoryState(hs, stateAncestors, cs);

        return { outputs: [], updates: [] };
      },
    },
    "n2::n0ღB": {
      event2: function (es, ed, stg) {
        let computed = actions["logBtoC"](es, ed, stg);
        cs = "n2::n1ღC";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
      event1: function (es, ed, stg) {
        let computed = actions["logBtoD"](es, ed, stg);
        cs = "n2::n2::n2ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n1ღC": {
      "": function (es, ed, stg) {
        let computed = actions["logCtoD"](es, ed, stg);
        cs = "n2::n2::n0ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = actions["logGroup1toD"](es, ed, stg);
        cs = "n2::n2::n0ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n2ღD": {
      event1: function (es, ed, stg) {
        let computed = actions["logDtoD"](es, ed, stg);
        cs = "n2::n2::n0ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
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
