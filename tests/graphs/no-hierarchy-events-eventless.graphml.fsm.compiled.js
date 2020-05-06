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
  var stateAncestors = {};
  var isStateWithEventlessTransition = { n4ღD: true };
  var isCompoundControlState = {};
  var cs = initialControlState;
  var es = initialExtendedState;
  var hs = { deep: { n1ღA: "", n2ღB: "", n3ღC: "", n4ღD: "" }, shallow: { n1ღA: "", n2ღB: "", n3ღC: "", n4ღD: "" } };

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
        let computed = actions["logAtoB"](es, ed, stg);

        cs = "n2ღB";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
      event2: function (es, ed, stg) {
        let computed = actions["logAtoC"](es, ed, stg);

        cs = "n3ღC";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    n2ღB: {
      event2: function (es, ed, stg) {
        let computed = actions["logBtoD"](es, ed, stg);

        cs = "n4ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

        return computed;
      },
    },
    n3ღC: {
      event1: function (es, ed, stg) {
        let computed = actions["logCtoD"](es, ed, stg);

        cs = "n4ღD";
        es = updateState(es, computed.updates);
        hs = updateHistoryState(hs, stateAncestors, cs);

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
          hs = updateHistoryState(hs, stateAncestors, cs);
        }
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
