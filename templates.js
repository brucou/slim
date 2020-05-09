const { resolve } = require('./helpers');
const { INIT_STATE, INIT_EVENT, DEEP, SHALLOW } = require('kingly');

const templateIntro = (usesHistoryStates, hasAutomaticEvents, nextEventMap) => ([[
  `var INIT_STATE = "${INIT_STATE}";`,
  `var INIT_EVENT = "${INIT_EVENT}";`,
  hasAutomaticEvents && `var nextEventMap = ${JSON.stringify(nextEventMap)}` || "",
  usesHistoryStates && `
  var DEEP = "${DEEP}";
  var SHALLOW = "${SHALLOW}";` || "",
  `\n`,
  ].join(''),
  usesHistoryStates && `
function updateHistoryState(history, stateAncestors, state_from_name) {
  if (state_from_name === INIT_STATE) {
    return history
  }
  else {
      var ancestors = stateAncestors[state_from_name] || [];
      ancestors.reduce((oldAncestor, newAncestor) => {
        // set the exited state in the history of all ancestors
        history[DEEP][newAncestor] = state_from_name;
        history[SHALLOW][newAncestor] = oldAncestor;

        return newAncestor
      }, state_from_name);

    return history
  }
}
`.trim() || ``,
  ``]).join('\n');

const transitionWithoutGuard = (action, to, usesHistoryStates) => {
  return [
    `function (es, ed, stg){`,
    `let computed = actions[\"${action.slice(3, -3)}\"](es, ed, stg)`,
    ``,
    `        cs = ${resolve(to)};`,
    `es = updateState(es, computed.updates);`,
    usesHistoryStates && `hs = updateHistoryState(hs, stateAncestors, cs); \n` || ``,
    `return computed`,
    `},`,
  ].join('\n');
};

const mainLoop = (nextEventMap, hasAutomaticEvents) => (`
function process(event){
  var eventLabel = Object.keys(event)[0];
  var eventData = event[eventLabel];
  
  var controlStateHandlingEvent = [cs].concat(stateAncestors[cs]||[]).find(function(controlState){
    return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
  });

  if (controlStateHandlingEvent) {
    // Run the handler
    var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

    // there was a transition, but no guards were fulfilled, we're done
    if (computed === null) return null

    // cs, es, hs have been updated in place by the handler
    // Run any automatic transition too
    ${hasAutomaticEvents ? `
    var outputs = computed.outputs;
    let nextEvent = nextEventMap[cs];
    if (nextEvent == null) return outputs
    const nextOutputs = process({[nextEvent]: eventData});
    
    return outputs.concat(nextOutputs)
    `.trim() : `
    return computed.outputs;
    `.trim()}
  }
  // Event is not accepted by the machine
  else {return null}
}

// Start the machine
process({[INIT_EVENT]: initialExtendedState});

return process
`).trim();

const esmExports = `
         export { createStateMachine }
`.trim();

const cjsExports = `
         module.exports = { 
         createStateMachine 
         }
`.trim();

module.exports = {
  templateIntro,
  transitionWithoutGuard,
  mainLoop,
  esmExports,
  cjsExports
};


