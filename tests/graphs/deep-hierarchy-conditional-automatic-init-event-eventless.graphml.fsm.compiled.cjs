// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
// const guards = {
//   "isNumber": function (){},
//   "not(isNumber)": function (){},
//   "shouldReturnToA": function (){},
// };
// -----Actions------
// const actions = {
//   "logAtoGroup1": function (){},
//   "logGroup1toGroup2": function (){},
//   "logGroup2toGroup3": function (){},
//   "logGroup3BtoGroup4": function (){},
//   "logGroup3toB": function (){},
//   "logGroup3toC": function (){},
//   "logAtoB": function (){},
//   "logAtoC": function (){},
//   "logBtoD": function (){},
//   "logCtoD": function (){},
//   "logDtoA": function (){},
// };
// ----------------
var nextEventMap = {
  "n2ღGroup 1": "init",
  "n2::n0ღB": "",
  "n2::n2ღGroup 2": "init",
  "n2::n2::n1ღGroup 3": "init",
  "n2::n2::n1::n3ღGroup 4": "init",
  "n2::n2::n1::n3::n3ღD": "",
};

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  var parentMap = {
    "n2::n0ღB": "n2ღGroup 1",
    "n2::n2ღGroup 2": "n2ღGroup 1",
    "n2::n2::n1ღGroup 3": "n2::n2ღGroup 2",
    "n2::n2::n1::n0ღB": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n2ღC": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n3ღGroup 4": "n2::n2::n1ღGroup 3",
    "n2::n2::n1::n3::n0ღA": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n1ღB": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n2ღC": "n2::n2::n1::n3ღGroup 4",
    "n2::n2::n1::n3::n3ღD": "n2::n2::n1::n3ღGroup 4",
  };
  var cs = "nok";
  var es = initialExtendedState;

  function getAncestors(cs) {
    return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : [];
  }

  var eventHandlers = {
    nok: {
      init: function (es, ed, stg) {
        cs = "n1ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    n1ღA: {
      event1: function (es, ed, stg) {
        let computed = actions["logAtoGroup1"](es, ed, stg);
        cs = "n2ღGroup 1";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n2::n0ღB": {
      "": function (es, ed, stg) {
        cs = "n2::n2ღGroup 2"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    "n2ღGroup 1": {
      init: function (es, ed, stg) {
        let computed = actions["logGroup1toGroup2"](es, ed, stg);
        cs = "n2::n0ღB";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n2::n2ღGroup 2": {
      init: function (es, ed, stg) {
        let computed = actions["logGroup2toGroup3"](es, ed, stg);
        cs = "n2::n2::n1ღGroup 3";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n0ღB": {
      event1: function (es, ed, stg) {
        let computed = actions["logGroup3BtoGroup4"](es, ed, stg);
        cs = "n2::n2::n1::n3ღGroup 4";
        es = updateState(es, computed.updates);

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
        }

        return computed;
      },
    },
    "n2::n2::n1::n3::n0ღA": {
      event1: function (es, ed, stg) {
        let computed = actions["logAtoB"](es, ed, stg);
        cs = "n2::n2::n1::n3::n1ღB";
        es = updateState(es, computed.updates);

        return computed;
      },
      event2: function (es, ed, stg) {
        let computed = actions["logAtoC"](es, ed, stg);
        cs = "n2::n2::n1::n3::n2ღC";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n3::n1ღB": {
      event2: function (es, ed, stg) {
        let computed = actions["logBtoD"](es, ed, stg);
        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(es, computed.updates);

        return computed;
      },
    },
    "n2::n2::n1::n3::n2ღC": {
      event1: function (es, ed, stg) {
        let computed = actions["logCtoD"](es, ed, stg);
        cs = "n2::n2::n1::n3::n3ღD";
        es = updateState(es, computed.updates);

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
        }

        return computed;
      },
    },
    "n2::n2::n1::n3ღGroup 4": {
      init: function (es, ed, stg) {
        cs = "n2::n2::n1::n3::n0ღA"; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
  };
  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = [cs].concat(getAncestors(cs) || []).find(function (controlState) {
      return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
    });

    if (controlStateHandlingEvent) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      return computed === null
        ? // If transition, but no guards fulfilled => null, else
          null
        : nextEventMap[cs] == null
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
