// Generated automatically by Kingly, version 0.7
// http://github.com/brucou/Kingly
// Copy-paste help
// For debugging purposes, guards and actions functions should all have a name
// Using natural language sentences for labels in the graph is valid
// guard and action functions name still follow JavaScript rules though
// -----Guards------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns Boolean
 */
// const guards = {
//   "!letter and numbers?": function (extendedState, eventData, settings){},
//   "letter and numbers?": function (extendedState, eventData, settings){},
// };
// -----Actions------
/**
 * @param {E} extendedState
 * @param {D} eventData
 * @param {X} settings
 * @returns {{updates: U[], outputs: O[]}}
 * (such that updateState:: E -> U[] -> E)
 */
// const actions = {
//   "display initial screen": function (extendedState, eventData, settings){},
//   "display weak password screen": function (extendedState, eventData, settings){},
//   "display strong password screen": function (extendedState, eventData, settings){},
//   "display password submitted screen": function (extendedState, eventData, settings){},
// };
// -------Control states---------
/*
      {"0":"nok","1":"doneღn1","2":"strongღn2","3":"weakღn3","4":"idleღn4"}
      */
// ------------------------------

function createStateMachine(fsmDefForCompile, stg) {
  var actions = fsmDefForCompile.actionFactories;
  var guards = fsmDefForCompile.guards;
  var updateState = fsmDefForCompile.updateState;
  var initialExtendedState = fsmDefForCompile.initialExtendedState;

  // Initialize machine state,
  // Start with pre-initial state "nok"
  var cs = 0;
  var es = initialExtendedState;

  var eventHandlers = [
    {
      init: function (s, ed, stg) {
        // Transition to idleღn4;
        cs = 4; // No action, only cs changes!

        return { outputs: [], updates: [] };
      },
    },
    ,
    {
      typed: function (s, ed, stg) {
        let computed = null;
        if (guards["letter and numbers?"](s, ed, stg)) {
          computed = actions["display strong password screen"](s, ed, stg);
          // Transition to "strongღn2";
          cs = 2;
        } else if (guards["!letter and numbers?"](s, ed, stg)) {
          computed = actions["display weak password screen"](s, ed, stg);
          // Transition to "weakღn3";
          cs = 3;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },

      "clicked submit": function (s, ed, stg) {
        let computed = actions["display password submitted screen"](s, ed, stg);
        // Transition to doneღn1;
        cs = 1;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
    {
      typed: function (s, ed, stg) {
        let computed = null;
        if (guards["!letter and numbers?"](s, ed, stg)) {
          computed = actions["display weak password screen"](s, ed, stg);
          // Transition to "weakღn3";
          cs = 3;
        } else if (guards["letter and numbers?"](s, ed, stg)) {
          computed = actions["display strong password screen"](s, ed, stg);
          // Transition to "strongღn2";
          cs = 2;
        }
        if (computed !== null) {
          es = updateState(s, computed.updates);
        }

        return computed;
      },
    },
    {
      start: function (s, ed, stg) {
        let computed = actions["display initial screen"](s, ed, stg);
        // Transition to weakღn3;
        cs = 3;
        es = updateState(s, computed.updates);

        return computed;
      },
    },
  ];

  function process(event) {
    var eventLabel = Object.keys(event)[0];
    var eventData = event[eventLabel];
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;

    if (controlStateHandlingEvent != null) {
      // Run the handler
      var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

      // cs, es, hs have been updated in place by the handler
      // If transition, but no guards fulfilled => null, else => computed outputs
      return computed === null ? [null] : computed.outputs;
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
