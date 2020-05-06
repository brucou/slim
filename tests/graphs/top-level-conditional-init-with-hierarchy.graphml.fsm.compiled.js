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
    "n1::n0ღNumber": ["n1ღGroup 1"],
    "n1::n2ღOther": ["n1ღGroup 1"],
    "n1::n3ღDone": ["n1ღGroup 1"],
  };
  var isStateWithEventlessTransition = {};
  var isCompoundControlState = { "n1ღGroup 1": true };
  var cs = initialControlState;
  var es = initialExtendedState;
  var hs = {
    deep: { "n1ღGroup 1": "", "n1::n0ღNumber": "", "n1::n2ღOther": "", "n1::n3ღDone": "" },
    shallow: { "n1ღGroup 1": "", "n1::n0ღNumber": "", "n1::n2ღOther": "", "n1::n3ღDone": "" },
  };

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n1ღGroup 1";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n1::n0ღNumber": {
      continue: function (es, ed, stg) {
        let computed = actions["logNumber"](es, ed, stg);

        cs = "n1::n3ღDone";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    "n1ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = actions["ACTION_IDENTITY"](es, ed, stg);
          cs = "n1::n0ღNumber";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = actions["ACTION_IDENTITY"](es, ed, stg);
          cs = "n1::n2ღOther";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
          hs = updateHistoryState(hs, stateAncestors, cs);
        }
        return computed;
      },
    },
    "n1::n2ღOther": {
      continue: function (es, ed, stg) {
        let computed = actions["logOther"](es, ed, stg);

        cs = "n1::n3ღDone";
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

export { createStateMachine };
