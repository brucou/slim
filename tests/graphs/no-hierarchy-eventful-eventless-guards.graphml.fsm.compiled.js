var INIT_STATE = "nok";
var INIT_EVENT = "init";
var nextEventMap = { n1ღA: null, n2ღTemp1: "", n3ღTemp2: "", n4ღDone: "" };

function createStateMachine(fsmDefForCompile, settings) {
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
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n1ღA: {
      event: function (es, ed, stg) {
        let computed = null;
        if (guards["condition1"](es, ed, stg)) {
          computed = actions["logAtoTemp1"](es, ed, stg);
          cs = "n2ღTemp1";
        } else if (guards["condition2"](es, ed, stg)) {
          computed = actions["logAtoTemp2"](es, ed, stg);
          cs = "n3ღTemp2";
        } else if (guards["condition3"](es, ed, stg)) {
          computed = actions["logAtoDone"](es, ed, stg);
          cs = "n4ღDone";
        }
        if (computed !== null) {
          es = updateState(es, computed.updates);
        }
        return computed;
      },
    },
    n2ღTemp1: {
      "": function (es, ed, stg) {
        let computed = actions["logTemp1toA"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n3ღTemp2: {
      "": function (es, ed, stg) {
        let computed = actions["logTemp2toA"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    n4ღDone: {
      "": function (es, ed, stg) {
        let computed = null;
        if (guards["shouldReturnToA"](es, ed, stg)) {
          computed = actions["ACTION_IDENTITY"](es, ed, stg);
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

export { createStateMachine };
