var INIT_STATE = "nok";
var INIT_EVENT = "init";

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
  var stateAncestors = {};
  var cs = initialControlState;
  var es = initialExtendedState;

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        let computed = null;
        if (guards["isNumber"](es, ed, stg)) {
          computed = actions["ACTION_IDENTITY"](es, ed, stg);
          cs = "n0ღNumber";
        } else if (guards["not(isNumber)"](es, ed, stg)) {
          computed = actions["ACTION_IDENTITY"](es, ed, stg);
          cs = "n2ღOther";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }
        return computed;
      },
    },
    n0ღNumber: {
      continue: function (es, ed, stg) {
        let computed = actions["logNumber"](es, ed, stg);

        cs = "n3ღDone";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n2ღOther: {
      continue: function (es, ed, stg) {
        let computed = actions["logOther"](es, ed, stg);

        cs = "n3ღDone";
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
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // there was a transition, but no guards were fulfilled, we're done
      if (computed === null) return null;

      // cs, es, hs have been updated in place by the handler
      // Run any automatic transition too
      return computed.outputs;
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
