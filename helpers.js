const parser = require('fast-xml-parser');
const { YED_DEEP_HISTORY_STATE, YED_SHALLOW_HISTORY_STATE, YED_ENTRY_STATE, SEP, DEFAULT_ACTION_FACTORY_STR, DEFAULT_ACTION_FACTORY } = require('./properties');
const { historyState, SHALLOW, DEEP, fsmContracts, createStateMachine } = require('kingly');
const { mapOverObj } = require('fp-rosetree');

function T() {
  return true;
}

// Error handling
function tryCatchFactory(errors) {
  // @side-effect: we modify errors in place
  return function tryCatch(fn, errCb) {
    return function tryCatch(...args) {
      try {
        return fn.apply(fn, args);
      }
      catch (e) {
        return errCb(e, errors, args);
      }
    };
  };
}

class Yed2KinglyConversionError extends Error {
  constructor(m) {
    super(m);
    this.errors = m;
    this.message = m.map(({ when, location, info, message }) => {
      // formatted message
      const fm = `At ${location}: ${when} => ${message}`;
      console.info(fm, info);
      console.error(m);
      return fm;
    }).concat([`See extra info in console`]).join('\n');
  }
}

function handleAggregateEdgesPerFromEventKeyErrors(e, errors, [hashMap, yedEdge]) {
  errors.push({
    when: `building (from, event) hashmap`,
    location: `computeTransitionsAndStatesFromXmlString > aggregateEdgesPerFromEventKey`,
    info: { hashMap: JSON.parse(JSON.stringify(hashMap)), yedEdge },
    message: e.message,
    possibleCauses: [
      `File is not a valid yed-generated graphML file`,
      `File is valid yed-generated graphML file but fails syntactic rules (cf. docs)`,
      `You found a bug in yed2Kindly converter`,
      // `You found a bug in fast-xml=parser (unlikely)`,
    ],
    original: e,
  });

  return {};
}

function handleParseGraphMlStringErrors(e, errors, [yedString]) {
  errors.push({
      when: `parsing the graphml string`,
      location: `computeTransitionsAndStatesFromXmlString > parser.parse`,
      info: { yedString },
      possibleCauses: [
        `File is not an XML file`,
        `File is not a graphML file`,
        `File is not a yed-generated graphML file`,
        // `File was read incorrectly from disk`,
        // `You found a bug in fast-xml=parser (unlikely)`,
        // `You found a bug in yed2Kindly converter (maybe)`,
      ],
      message: e.message,
      original: e,
    },
  );

  return {};
}

// Predicates
function isCompoundState(graphObj) {
  return graphObj['@_yfiles.foldertype'] === 'group';
}

function isGraphRoot(graphObj) {
  return 'key' in graphObj;
}

// DOC: init, Init, INIT: all work
function isInitialTransition(yedFrom, userFrom) {
  return userFrom.toUpperCase() === YED_ENTRY_STATE.toUpperCase();
}

function isTopLevelInitTransition(yedFrom, userFrom) {
  // yEd internal naming is nX::Ny::... so a top-level node will be just nX
  return isInitialTransition(yedFrom, userFrom) && yedFrom.split('::').length === 1;
}

function isHistoryDestinationState(stateYed2KinglyMap, yedTo) {
  const x = stateYed2KinglyMap[yedTo].trim();
  return x === YED_SHALLOW_HISTORY_STATE || x === YED_DEEP_HISTORY_STATE;
}

function isDeepHistoryDestinationState(stateYed2KinglyMap, yedTo) {
  const x = stateYed2KinglyMap[yedTo].trim();
  return isHistoryDestinationState(stateYed2KinglyMap, yedTo) && x === YED_DEEP_HISTORY_STATE;
}

// Conversion helpers
// iff no predicate, and only one transition in array
function isSimplifiableSyntax(arrGuardsTargetActions) {
  return arrGuardsTargetActions.length === 1 && !arrGuardsTargetActions[0].predicate;
}

function getYedParentNode(yedFrom) {
  return yedFrom.split('::').slice(0, -1).join('::');
}

function yedState2KinglyState(stateYed2KinglyMap, yedState) {
  return [stateYed2KinglyMap[yedState], yedState].join(SEP);
}

function computeKinglyDestinationState(stateYed2KinglyMap, yedTo) {
  if (isHistoryDestinationState(stateYed2KinglyMap, yedTo)) {
    return isDeepHistoryDestinationState(stateYed2KinglyMap, yedTo)
      ? historyState(DEEP, yedState2KinglyState(stateYed2KinglyMap, getYedParentNode(yedTo)))
      : historyState(SHALLOW, yedState2KinglyState(stateYed2KinglyMap, getYedParentNode(yedTo)));

  }
  else {
    return yedState2KinglyState(stateYed2KinglyMap, yedTo);
  }
}

function mapActionFactoryStrToActionFactoryFn(actionFactories, actionFactoryStr) {
  return actionFactoryStr === DEFAULT_ACTION_FACTORY_STR
    ? DEFAULT_ACTION_FACTORY
    : actionFactories[actionFactoryStr];
}

function mapGuardStrToGuardFn(guards, predicateStr) {
  return guards[predicateStr] || T;
}

function markArrayFunctionStr(_, arr) {
  return arr.map(str => ['', '', '', str, '', '', ''].join(SEP));
}

function markFunctionNoop(_, str) {
  return () => ({ outputs: [], updates: [] });
}

function markGuardNoop(_, str) {
  return () => true;
}

function contains(as, bs) {
  // returns true if every a in as can be found in bs
  return as.every(a => bs.indexOf(a) > -1);
}

// Parsing
function parseGraphMlString(yedString) {
  // true as third param validates the xml string prior to parsing, possibly throws
  // cf. https://github.com/NaturalIntelligence/fast-xml-parser#xml-to-json
  // Validator returns the following object in case of error;
  // {
  //   err: {
  //     code: code,
  //       msg: message,
  //       line: lineNumber,
  //   },
  // };
  const jsonObj = parser.parse(yedString, { ignoreAttributes: false }, true);
  if (!jsonObj.graphml) throw `Not a graphml file? Could not find a <graphml> tag!`;

  return jsonObj;
}

// Test helpers
function isFunction(obj) {
  return typeof obj === 'function';
}

function isPOJO(obj) {
  const proto = Object.prototype;
  const gpo = Object.getPrototypeOf;

  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  return gpo(obj) === proto;
}

function formatResult(result) {
  if (!isPOJO(result)) {
    return result;
  }
  else {
    return mapOverObj({
        key: x => x,
        leafValue: prop => isFunction(prop)
          ? (prop.name || prop.displayName || 'anonymous')
          : Array.isArray(prop)
            ? prop.map(formatResult)
            : prop,
      },
      result);
  }
}

const fakeConsole = {
  log: () => {
  },
  error: () => {
  },
  warn: () => {
  },
  info: () => {
  },
  debug: () => {
  },
};

function checkKinglyContracts(states, events, transitions) {
  try {
    return createStateMachine({
      initialExtendedState: void 0,
      events,
      states,
      transitions,
      updateState: () => {
      },
    }, { debug: { console: fakeConsole, checkContracts: fsmContracts } });
  }
  catch (err) {
    console.error(err);
    return null;
  }
}

// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
// let output = cartesian([1,2],[10,20],[100,200,300]);
// This is the output of that command:
//
//   ```
// [ [ 1, 10, 100 ],
//   [ 1, 10, 200 ],
//   [ 1, 10, 300 ],
//   [ 1, 20, 100 ],
//   [ 1, 20, 200 ],
//   [ 1, 20, 300 ],
//   [ 2, 10, 100 ],
//   [ 2, 10, 200 ],
//   [ 2, 10, 300 ],
//   [ 2, 20, 100 ],
//   [ 2, 20, 200 ],
//   [ 2, 20, 300 ] ]
// ```
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

function resolve(to, stateIndexList) {
  const type = typeof to === 'object' ? Object.keys(to)[0] : null;
  return type ? `hs[${JSON.stringify(type)}][${JSON.stringify(stateIndexList[to[type]])}]` : JSON.stringify(stateIndexList[to]);
}

function formatControlState(to) {
  const type = typeof to === 'object' ? Object.keys(to)[0] : null;
  return type ? `${JSON.stringify(type)} history state for ${JSON.stringify(to[type])}` : JSON.stringify(to);
}

function trimInside(str) {
  return str.replace(/\n/gm, ' ').replace(/\r/gm, ' ').replace(/\s+/g, ' ');
}

function computeParentMapFromHistoryMaps(historyMaps, stateIndexList, stateListWithNok) {
  const { stateList, stateAncestors } = historyMaps;
  // Example of stateAncestors
  // var stateAncestors = {
  //   "n2::n0ღHome route": ["n2ღApplication core"],
  //   "n2::n0::n0ღFeeds": ["n2::n0ღHome route", "n2ღApplication core"],
  //   "n2::n0::n0::n0ღFetching global feed": ["n2::n0::n0ღFeeds", "n2::n0ღHome route", "n2ღApplication core"],
  //   "n2::n5::n3ღChecking user": ["n2::n5ღArticle route", "n2ღApplication core"],
  //   "n2::n5::n4ღcan (un)like": ["n2::n5ღArticle route", "n2ღApplication core"],
  //   "n2::n5::n5ღcan (un)follow": ["n2::n5ღArticle route", "n2ღApplication core"],
  // };
  const css = Object.keys(stateAncestors);
  // mapping cs index to cs parent index
  const parentMap = stateListWithNok.map(cs => {
    return stateIndexList[stateAncestors[cs] && stateAncestors[cs][0] || -1]
  })
    // css.map(cs => stateIndexList[stateAncestors[cs][0]]);
  return parentMap;
};

function getCommentsHeader(transitionsWithoutGuardsActions, stateListWithNok) {
  // Stringify the transitions without guards and actions (we just have the names of such)
  // to hold the guards and actions
  let predicateList = new Set();
  let actionList = new Set();
  // Used to compute predicateList and actionList
  transitionsWithoutGuardsActions.map(transitionRecord => {
    const { from, event, guards } = transitionRecord;
    // console.warn(`getCommentsHeader > transitionRecord > guards`, guards);
    return `
           { from: "${from}", event: "${event}", guards: [
           ${guards.map(guardRecord => {
      const { predicate, to, action } = guardRecord;
      const predicates = predicate.map(x => x.slice(3, -3)).filter(Boolean);
      const actions = action.map(x => x.slice(3, -3)).filter(Boolean);
      predicates.forEach(x => predicateList.add(x));
      actions.forEach(x => actionList.add(x));

      return `
          {predicate: every(${JSON.stringify(predicates)}, guards), to: ${JSON.stringify(to)}, action: chain(${JSON.stringify(actions)}, aF)}, 
          `.trim();
    }).join('\n')
      }
      ]}
        `.trim().concat(', ');
  }).join('\n');

  return `
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
      // const guards = {${Array.from(predicateList)
    .map(pred => `\n//   "${pred}": function (extendedState, eventData, settings){},`)
    .join('')}
      // };
      // -----Actions------
      /**
      * @param {E} extendedState
      * @param {D} eventData
      * @param {X} settings
      * @returns {{updates: U[], outputs: O[]}}
      * (such that updateState:: E -> U[] -> E)
      */
      // const actions = {${Array.from(actionList)
    .map(action => `\n//   "${action}": function (extendedState, eventData, settings){},`)
    .join('')}
      // };
      // -------Control states---------
      /*
      ${JSON.stringify(stateListWithNok.reduce((acc, cs, i) => (acc[i] = cs, acc), {}))}
      */
      // ------------------------------
      `.trim();
}

const frontHeader = `
// Generated automatically by Kingly, version 0.29
// http://github.com/brucou/Kingly
`.trim();

function isTransitionWithoutGuard(guards){
  return guards.length === 1 && guards[0].predicate.length === 0
}

function getIndexedHistoryStates(initialHistoryStateKingly, stateListWithNok){
  return Object.keys(initialHistoryStateKingly).reduce( (acc, historyType) => {
    acc[historyType] = stateListWithNok.map(cs => -1)
    return acc
  },{})
}


module.exports = {
  T,
  tryCatchFactory,
  Yed2KinglyConversionError,
  handleAggregateEdgesPerFromEventKeyErrors,
  handleParseGraphMlStringErrors,
  isCompoundState,
  isGraphRoot,
  isInitialTransition,
  isTopLevelInitTransition,
  isSimplifiableSyntax,
  getYedParentNode,
  yedState2KinglyState,
  computeKinglyDestinationState,
  mapActionFactoryStrToActionFactoryFn,
  mapGuardStrToGuardFn,
  parseGraphMlString,
  formatResult,
  cartesian,
  markFunctionStr: markArrayFunctionStr,
  markFunctionNoop,
  markGuardNoop,
  checkKinglyContracts,
  fakeConsole,
  contains,
  resolve,
  trimInside,
  computeParentMapFromHistoryMaps,
  getCommentsHeader,
  frontHeader,
  isTransitionWithoutGuard,
  getIndexedHistoryStates,
  formatControlState,
};

