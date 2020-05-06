var INIT_STATE = "nok";
var INIT_EVENT = "init";
var DEEP = "deep";
var SHALLOW = "shallow";

function updateHistoryState(history, stateAncestors, state_from_name) {
  if (state_from_name === INIT_STATE) {
    return history;
  } else {
    var ancestors = stateAncestors[state_from_name] || [];
    ancestors.reduce((oldAncestor, newAncestor) => {
      // set the exited state in the history of all ancestors
      history[DEEP][newAncestor] = state_from_name;
      history[SHALLOW][newAncestor] = oldAncestor;

      return newAncestor;
    }, state_from_name);

    return history;
  }
}

function createStateMachine(fsmDefForCompile, settings) {
  var actions = fsmDefForCompile.actionFactories;
  actions["ACTION_IDENTITY"] = function () {
    return { updates: [], outputs: [] };
  };
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialControlState = INIT_STATE;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // initialize
  var stateAncestors = {
    "n2::n0ღB": ["n2ღGroup 1"],
    "n2::n2ღGroup 2": ["n2ღGroup 1"],
    "n2::n2::n1ღGroup 3": ["n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n0ღB": ["n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n2ღC": ["n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n3ღGroup 4": ["n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n3::n0ღA": ["n2::n2::n1::n3ღGroup 4", "n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n3::n1ღB": ["n2::n2::n1::n3ღGroup 4", "n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n3::n2ღC": ["n2::n2::n1::n3ღGroup 4", "n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
    "n2::n2::n1::n3::n3ღD": ["n2::n2::n1::n3ღGroup 4", "n2::n2::n1ღGroup 3", "n2::n2ღGroup 2", "n2ღGroup 1"],
  };
  var isStateWithEventlessTransition = { "n2::n0ღB": true, "n2::n2::n1::n3::n3ღD": true };
  var isCompoundControlState = {
    "n2ღGroup 1": true,
    "n2::n2ღGroup 2": true,
    "n2::n2::n1ღGroup 3": true,
    "n2::n2::n1::n3ღGroup 4": true,
  };
  var cs = initialControlState;
  var es = initialExtendedState;
  var hs = {
    deep: {
      n1ღA: "",
      "n2ღGroup 1": "",
      "n2::n0ღB": "",
      "n2::n2ღGroup 2": "",
      "n2::n2::n1ღGroup 3": "",
      "n2::n2::n1::n0ღB": "",
      "n2::n2::n1::n2ღC": "",
      "n2::n2::n1::n3ღGroup 4": "",
      "n2::n2::n1::n3::n0ღA": "",
      "n2::n2::n1::n3::n1ღB": "",
      "n2::n2::n1::n3::n2ღC": "",
      "n2::n2::n1::n3::n3ღD": "",
    },
    shallow: {
      n1ღA: "",
      "n2ღGroup 1": "",
      "n2::n0ღB": "",
      "n2::n2ღGroup 2": "",
      "n2::n2::n1ღGroup 3": "",
      "n2::n2::n1::n0ღB": "",
      "n2::n2::n1::n2ღC": "",
      "n2::n2::n1::n3ღGroup 4": "",
      "n2::n2::n1::n3::n0ღA": "",
      "n2::n2::n1::n3::n1ღB": "",
      "n2::n2::n1::n3::n2ღC": "",
      "n2::n2::n1::n3::n3ღD": "",
    },
  };

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    n1ღA: {
      event1: function (es, ed, stg) {
        let computed = actions["logAtoGroup1"](es, ed, stg);

        cs = "n2ღGroup 1";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n0ღB": {
      "": function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n2::n2ღGroup 2";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = actions["logGroup1toGroup2"](es, ed, stg);

        cs = "n2::n0ღB";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2ღGroup 2": {
      init: function (es, ed, stg) {
        let computed = actions["logGroup2toGroup3"](es, ed, stg);

        cs = "n2::n2::n1ღGroup 3";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1::n0ღB": {
      event1: function (es, ed, stg) {
        let computed = actions["logGroup3BtoGroup4"](es, ed, stg);

        cs = "n2::n2::n1::n3ღGroup 4";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1ღGroup 3": {
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = actions["logGroup3toB"](es, ed, stg);
          cs = "n2::n2::n1::n0ღB";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = actions["logGroup3toC"](es, ed, stg);
          cs = "n2::n2::n1::n2ღC";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
          hs = updateHistoryState(hs, stateAncestors, cs);
        }
        return computed;
      },
    },
    "n2::n2::n1::n3::n0ღA": {
      event1: function (es, ed, stg) {
        let computed = actions["logAtoB"](es, ed, stg);

        cs = "n2::n2::n1::n3::n1ღB";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
      event2: function (es, ed, stg) {
        let computed = actions["logAtoC"](es, ed, stg);

        cs = "n2::n2::n1::n3::n2ღC";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1::n3::n1ღB": {
      event2: function (es, ed, stg) {
        let computed = actions["logBtoD"](es, ed, stg);

        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1::n3::n2ღC": {
      event1: function (es, ed, stg) {
        let computed = actions["logCtoD"](es, ed, stg);

        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n2::n2::n1::n3::n3ღD": {
      "": function (es, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](es, ed, stg)) {
          computed = actions["logDtoA"](es, ed, stg);
          cs = "n2::n2::n1::n3::n0ღA";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
          hs = updateHistoryState(hs, stateAncestors, cs);
        }
        return computed;
      },
    },
    "n2::n2::n1::n3ღGroup 4": {
      init: function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n2::n2::n1::n3::n0ღA";
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
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, settings);

      // there was a transition, but no guards were fulfilled, we're done
      if (computed === null) return null;

      // cs, es, hs have been updated in place by the handler
      // Run any automatic transition too
      var outputs = computed.outputs;
      let nextEvent = isCompoundControlState[cs] ? INIT_EVENT : isStateWithEventlessTransition[cs] ? "" : null;
      let nextOutputs = [];
      if (nextEvent !== null) {
        nextOutputs = process({ [nextEvent]: eventData });
      }

      return outputs.concat(nextOutputs);
    }
    // Event is not accepted by the machine
    else {
      return null;
    }
  }

  // Start the machine
  process({ [INIT_EVENT]: initialExtendedState });

  return process;
}

module.exports = {
  createStateMachine,
};
