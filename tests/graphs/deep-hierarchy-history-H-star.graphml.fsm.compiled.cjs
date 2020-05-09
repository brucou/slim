var INIT_STATE = "nok";
var INIT_EVENT = "init";
var nextEventMap = {
  n1ღE: "",
  "n2ღGroup 1": "init",
  "n2::n0ღB": null,
  "n2::n1ღC": "",
  "n2::n2ღGroup 1": "init",
  "n2::n2::n0ღD": null,
  "n2::n2::n2ღD": null,
};
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

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  actions["ACTION_IDENTITY"] = function () {
    return { updates: [], outputs: [] };
  };
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialControlState = INIT_STATE;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state
  var stateAncestors = {
    "n2::n0ღB": ["n2ღGroup 1"],
    "n2::n1ღC": ["n2ღGroup 1"],
    "n2::n2ღGroup 1": ["n2ღGroup 1"],
    "n2::n2::n0ღD": ["n2::n2ღGroup 1", "n2ღGroup 1"],
    "n2::n2::n2ღD": ["n2::n2ღGroup 1", "n2ღGroup 1"],
  };
  var cs = initialControlState;
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
        let computed = actions["logGroup1toH*"](es, ed, stg);

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
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = hs["deep"]["n2ღGroup 1"];
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    nok: {
      init: function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n2::n0ღB";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
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

      // there was a transition, but no guards were fulfilled, we're done
      if (computed === null) return null;

      // cs, es, hs have been updated in place by the handler
      // Run any automatic transition too
      var outputs = computed.outputs;
      let nextEvent = nextEventMap[cs];
      if (nextEvent == null) return outputs;
      const nextOutputs = process({ [nextEvent]: eventData });

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
