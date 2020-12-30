const { resolve, formatControlState } = require('./helpers');
const { INIT_STATE, INIT_EVENT, DEEP, SHALLOW, ACTION_IDENTITY } = require('kingly');

const implDoStr = `
function chain(arrFns, actions) {
  return function chain_(s, ed, stg) {
    return (
      arrFns.reduce(function(acc, fn) {
        var r = actions[fn](s, ed, stg);

        return {
          updates: acc.updates.concat(r.updates),
          outputs: acc.outputs.concat(r.outputs),
        };
      }, { updates: [], outputs: [] })
    );
  };
}
`;

const templateIntro = ({usesHistoryStates, hasAutomaticEvents, nextEventMap, hasChainedActions}) => ([[
  hasAutomaticEvents && `var nextEventMap = ${JSON.stringify(nextEventMap)}` || '',
  `\n`,
].join(''),
  hasChainedActions && implDoStr || "",
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

const transitionWithoutGuard = (action, to, usesHistoryStates, stateIndexList) => {
  // We remove the actions with empty names
  // Those means don't do anything
  const actionNames = action.map(a => a.slice(3, -3)).filter(Boolean);
  // console.warn(`transitionWithoutGuard > actionNames`, actionNames)
  let computedStr = '';
  let isActionIdentity = false;
  if (actionNames.length === 0) {
    isActionIdentity = true;
  }
  else if (actionNames.length === 1) {
    computedStr = `var computed = actions["${actionNames[0]}"](s, ed, stg);`;
  }
  else  {
    computedStr = `var computed = chain(${JSON.stringify(actionNames)}, actions)(s, ed, stg);`;
  }

  const toIndex = resolve(to, stateIndexList);
  // console.warn(`toIndex `, stateIndexList, to, resolve(to), toIndex)

  return [
    `function (s, ed, stg){`,
    isActionIdentity
      ? `
        // Transition to ${to};
        cs = ${toIndex}; // No action, only cs changes!
        `.trim()
      : `
        ${computedStr}
        // Transition to ${to};
        cs = ${toIndex};
        es = updateState(s, computed.updates);
      `.trim(),
    usesHistoryStates && `hs = updateHistoryState(hs, getAncestors, cs); \n` || ``,
    isActionIdentity ? `return ${JSON.stringify(ACTION_IDENTITY())}` : `return computed`,
    `},`,
  ].join('\n');
};


function transitionWithGuards(guards, usesHistoryStates, stateIndexList) {
  let predicateStr = "";
  let actionStr  = "";
  return [
    `function (s, ed, stg){`,
    `let computed = null;`,
    guards.map(({ predicate: _predicateList, to, action: _actionList }, index) => {
      const predicateList = _predicateList.map(x => x.slice(3, -3));
      // We remove the actions entered in yed with empty strings (edge case)
      const actionList= _actionList.map(x => x.slice(3, -3)).filter(Boolean);
      // console.warn(`predicateList `, predicateList);
      // console.warn(`actionList`, actionList);
      if (predicateList.length === 1) {
        predicateStr = `guards["${predicateList[0]}"](s, ed, stg)`
      }
      else {
        // We have a guard if we arrive here => predicateList.length > 1
        predicateStr = predicateList.map(p => `guards["${p}"](s, ed, stg)`).join(`&&`);
        // predicateStr = `${JSON.stringify(predicateList)}.every(p => guards[p](s, ed, stg))`
      }

      if (actionList.length === 0) {
        actionStr = `computed =  ${JSON.stringify(ACTION_IDENTITY())};`
      }
      else if (actionList.length === 1) {
        actionStr = `computed = actions["${actionList[0]}"](s, ed, stg);`
      }
      else {
        // predicateList.length > 1
        actionStr = `computed = chain(${JSON.stringify(actionList)}, actions)(s, ed, stg);`
      }

        return `${index ? 'else if' : 'if'} (${predicateStr}) {
        ${actionStr}
                // Transition to ${formatControlState(to)};
        cs = ${resolve(to, stateIndexList)};}`;
    }).join('\n'),
    `if (computed !== null) {
                      es = updateState(s, computed.updates);`,
    usesHistoryStates && `hs = updateHistoryState(hs, getAncestors, cs);` || '',
    `                  }
                        
                    return computed
                  `,
    `},`,
  ].join('\n');
}

const isGraphWithoutCompoundStates = stateAncestors => Object.keys(stateAncestors).length === 0;

const mainLoop = ({ nextEventMap, hasAutomaticEvents, stateAncestors }) => (`
function process(event){
  var eventLabel = Object.keys(event)[0];
  var eventData = event[eventLabel];
${isGraphWithoutCompoundStates(stateAncestors)
  ? `
    var controlStateHandlingEvent = (eventHandlers[cs] || {})[eventLabel] && cs;
`.trim()
  : `
  var controlStateHandlingEvent = [cs].concat(getAncestors(cs)||[]).find(function(controlState){
    return Boolean(eventHandlers[controlState] && eventHandlers[controlState][eventLabel]);
  });
  // console.warn('controlStateHandlingEvent', controlStateHandlingEvent);
`.trim()
  }   

  if (controlStateHandlingEvent != null) {
    // Run the handler
    var computed = eventHandlers[controlStateHandlingEvent][eventLabel](es, eventData, stg);

    // cs, es, hs have been updated in place by the handler
    ${hasAutomaticEvents ? `
    return computed === null
    // If transition, but no guards fulfilled => null, else 
     ? [null]
     : nextEventMap[cs] === -1
       ? computed.outputs
    // Run automatic transition if any
       : computed.outputs.concat(process({[nextEventMap[cs]]: eventData}))
    `.trim() : `
    // If transition, but no guards fulfilled => null, else => computed outputs
    return computed === null ? [null] : computed.outputs;
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
  transitionWithGuards,
  mainLoop,
  ImplDoStr: implDoStr,
  esmExports,
  cjsExports,
};



