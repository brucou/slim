const { resolve } = require('./helpers');
const { INIT_STATE, INIT_EVENT, DEEP, SHALLOW, ACTION_IDENTITY } = require('kingly');

const templateIntro = (usesHistoryStates, hasAutomaticEvents, nextEventMap) => ([[
  // `var INIT_STATE = "${INIT_STATE}";`,
  // `var INIT_EVENT = "${INIT_EVENT}";`,
  hasAutomaticEvents && `var nextEventMap = ${JSON.stringify(nextEventMap)}` || "",
  // usesHistoryStates && `
  // var DEEP = "${DEEP}";
  // var SHALLOW = "${SHALLOW}";` || "",
  `\n`,
  ].join(''),
  usesHistoryStates && `
function updateHistoryState(history, getAncestors, state_from_name) {
  if (state_from_name === ${JSON.stringify(INIT_STATE)}) {
    return history
  }
  else {
      var ancestors = getAncestors(state_from_name) || [];
      ancestors.reduce((oldAncestor, newAncestor) => {
        // set the exited state in the history of all ancestors
        history[${JSON.stringify(DEEP)}][newAncestor] = state_from_name;
        history[${JSON.stringify(SHALLOW)}][newAncestor] = oldAncestor;

        return newAncestor
      }, state_from_name);

    return history
  }
}
`.trim() || ``,
  ``]).join('\n');

const transitionWithoutGuard = (action, to, usesHistoryStates) => {
  const actionName = action.slice(3, -3);
  const isActionIdentity = actionName === 'ACTION_IDENTITY';
  const computed = isActionIdentity ? ACTION_IDENTITY(): null;

    return [
    `function (es, ed, stg){`,
      isActionIdentity
        ? `
        cs = ${resolve(to)}; // No action, only cs changes!
        `.trim()
      : `
      let computed = actions[\"${action.slice(3, -3)}\"](es, ed, stg);
        cs = ${resolve(to)};
        es = updateState(es, computed.updates);
      `.trim(),
    // ``,
    // `        cs = ${resolve(to)};`,
    // `es = updateState(es, computed.updates);`,
    usesHistoryStates && `hs = updateHistoryState(hs, getAncestors, cs); \n` || ``,
      isActionIdentity ? `return ${JSON.stringify(computed)}`: `return computed`,
    `},`,
  ].join('\n');
};

const isGraphWithoutCompoundStates = stateAncestors => Object.keys(stateAncestors).length === 0;

const mainLoop = (nextEventMap, hasAutomaticEvents, stateAncestors) => (`
function process(event){
  var eventLabel = Object.keys(event)[0];
  var eventData = event[eventLabel];
${isGraphWithoutCompoundStates(stateAncestors)
? `
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;
`.trim()
:`
  var controlStateHandlingEvent = [cs].concat(getAncestors(cs)||[]).find(function(controlState){
    return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
  });
`.trim()   
}   

  if (controlStateHandlingEvent) {
    // Run the handler
    var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

    // cs, es, hs have been updated in place by the handler
    ${hasAutomaticEvents ? `
    return computed === null
    // If transition, but no guards fulfilled => null, else 
     ? null
     : nextEventMap[cs] == null
       ? computed.outputs
    // Run automatic transition if any
       : computed.outputs.concat(process({[nextEventMap[cs]]: eventData}))
    `.trim() : `
    // If transition, but no guards fulfilled => null, else => computed outputs
    return computed === null ? null : computed.outputs;
    `.trim()}
  }
  // Event is not accepted by the machine
  else return null
}

// Start the machine
process({[${JSON.stringify(INIT_EVENT)}]: initialExtendedState});

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


