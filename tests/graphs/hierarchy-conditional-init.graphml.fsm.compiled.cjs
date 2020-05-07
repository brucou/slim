var INIT_STATE = "nok";
var INIT_EVENT = "init";
var DEEP = "deep";
var SHALLOW = "shallow";

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
  var stateAncestors = { "n2::n0ღB": ["n2ღGroup 1"], "n2::n2ღC": ["n2ღGroup 1"] };
  var isStateWithEventlessTransition = {};
  var isCompoundControlState = { "n2ღGroup 1": true };
  var cs = initialControlState;
  var es = initialExtendedState;

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
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
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n2ღGroup 1";
        es = updateState(es, computed.updates);

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
