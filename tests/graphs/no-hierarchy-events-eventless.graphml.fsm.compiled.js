var INIT_STATE = "nok";
var INIT_EVENT = "init";
var nextEventMap = { n1ღA: null, n2ღB: null, n3ღC: null, n4ღD: "" };

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
        let computed = actions["ACTION_IDENTITY"](es, ed, stg);

        cs = "n1ღA";
        es = updateState(es, computed.updates);

        return computed;
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

export { createStateMachine };
