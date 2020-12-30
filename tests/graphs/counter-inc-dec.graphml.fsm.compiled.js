import {somefuncion} from "z"

export const createStateMachine  = (function (){
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
//   "is it": function (extendedState, eventData, settings){},
//   "is it not": function (extendedState, eventData, settings){},
// };
// -----Actions------
  /**
   * @param {E} extendedState
   * @param {D} eventData
   * @param {X} settings
   * @returns {{updates: U[], outputs: O[]}}
   * (such that updateState:: E -> U[] -> E)
   */
  function incrementCounter(extendedState, eventData, settings){somefuncion}
  function render(extendedState, eventData, settings){}
  function decrementCounter(extendedState, eventData, settings){}
  function rendersomemore(extendedState, eventData, settings){}
// -------Control states---------
  /*
        {"0":"nok","1":"idleღn1"}
        */
// ------------------------------

  function chain(arrFns, actions) {
    return function chain_(s, ed, stg) {
      return arrFns.reduce(
        function (acc, fn) {
          var r = actions[fn](s, ed, stg);

          return {
            updates: acc.updates.concat(r.updates),
            outputs: acc.outputs.concat(r.outputs),
          };
        },
        { updates: [], outputs: [] }
      );
    };
  }

  return function createStateMachine(fsmDefForCompile, stg) {
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
          // Transition to idleღn1;
          cs = 1; // No action, only cs changes!

          return { outputs: [], updates: [] };
        },
      },
      {
        "click inc": function (s, ed, stg) {
          let computed = null;
          if (guards["is it"](s, ed, stg) && guards["is it not"](s, ed, stg)) {
            computed = chain([incrementCounter, render], actions)(s, ed, stg);
            // Transition to "idleღn1";
            cs = 1;
          }
          if (computed !== null) {
            es = updateState(s, computed.updates);
          }

          return computed;
        },

        "click dec": function (s, ed, stg) {
          var computed = chain([decrementCounter, render, rendersomemore], actions)(s, ed, stg);
          // Transition to idleღn1;
          cs = 1;
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



}())

