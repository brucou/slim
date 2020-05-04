// TODO
const { Try, TryModule, Success, Failure, None, Some, Left, Right } = require('funfix');
const { initHistoryDataStructure, computeHistoryMaps, ACTION_IDENTITY, NO_OUTPUT, NO_STATE_UPDATE, fsmContracts } = require('kingly');
const ejs = require('ejs');
const { concat } = require('ramda');
const { templateIntro, transitionWithoutGuard,mainLoop, cjsExports, esmExports } = require('./templates');
// This one is from jest and is terrific to format object nicely
// but we used JSON.stringify in the end as we need JS-legit formatting here
// Kept here because I never remember the name of the module
// const prettyFormat = require('pretty-format');
const prettier = require('prettier');
const fs = require('fs');
const { Command } = require('commander');
const { computeTransitionsAndStatesFromXmlString } = require('./conversion');
const { checkKinglyContracts, resolve } = require('./helpers');
const { DEFAULT_ACTION_FACTORY_STR } = require('./properties');
const program = new Command();

// Configure syntax, parse and run
program
  .version('0.1.0')
  .arguments('<file>')
  .action(compileYedFile);
program.parse(process.argv);

var template = `
function createStateMachine(fsmDefForCompile, settings) {
const actions = fsmDefForCompile.actions;
const guards = fsmDefForCompile.guards;
const updateState = fsmDefForCompile.updateState;
const initialControlState = fsmDefForCompile.initialControlState;
const initialExtendedState = fsmDefForCompile.initialExtendedState;

// initialize
const eventHandlers = {};
let cs = initialControlState;
let es = initialExtendedState;
let hs = <%- initialHistoryState %>;

const eventHandlers = {
  <% transitions.forEach((from, event, to, action, guards) => {  %>
    <%- from%>: { 
       <%- event? event: 'auto' %>:  <% if (!guards) {%>  actions[actionName]
       <% } else { %>
         function (es, ed, stg){
           let computed = null;
           guards.some({predicate, to, action} => {
             if (predicate(es, ed, stg)) { computed = action(es, ed, stg), true } else return false
           })
           
           return computed
         }
       <% } %>
}
  <% })   %>

  return function process(event){
    // loop
  }
}
`.trim();


// Conversion function
// DOC: We export two files: one cjs for node.js and js for browser esm consumption
// NTH: May could be the export through an option (to generate module.exports = ...)
// NTH: handle several files at the same time
// NTH: add an output option
function compileYedFile(_file) {
  const file = _file.endsWith('.graphml') ? _file : `${file}.graphml`;

  // Read the file
  const result = Try.of(() => fs.readFileSync(file, 'utf8'))
  // Get the machine data from the file
    .flatMap(yedString => Try.of(() => {
        const {
          states,
          stateYed2KinglyMap,
          events,
          transitionsWithoutGuardsActions,
          transitionsWithFakeGuardsActions,
          getKinglyTransitions,
          errors,
        } = computeTransitionsAndStatesFromXmlString(yedString);

        if (errors.length > 0) {
          console.error(`${errors.length} error(s) found! See log.`);
          errors.map(console.error);
          throw new Error(errors);
        }
        const isValid = checkKinglyContracts(states, events, transitionsWithFakeGuardsActions);
        // This is an option actually. If not null then it is an array of errors
        if (!isValid) {
          // console.error(`The input graph does not represent a valid Kingly machine! Cf. log.`)
          console.error(isValid);
          throw new Error(`The input graph does not represent a valid Kingly machine! Cf. log.`);
        }
        // So we read the file, we have our transitions, states and events for a valid graph,
        // let's compile\

        const historyMaps = computeHistoryMaps(states);
        const initialHistoryState = initHistoryDataStructure(historyMaps.stateList);
        const stateAncestors = historyMaps.stateAncestors;
        const transitions = transitionsWithoutGuardsActions;
        const transitionsPerOrigin = transitions.reduce((acc, transition) => {
          const { from, event } = transition;
          acc[from] = acc[from] || {};
          acc[from][event] = transition;
          return acc;
        }, {});
        const isStateWithEventlessTransition = transitions.reduce((isStateWithEventlessTransition, transition) => {
          const { from, event } = transition;
          if (event === "") {isStateWithEventlessTransition[from] = true};

          return isStateWithEventlessTransition;
        }, {});
        // TODO
      const isCompoundControlState = historyMaps.stateList.reduce((acc, state) => {
        if (stateAncestors && stateAncestors[state]) {
          stateAncestors[state].forEach(stateAncestor => acc[stateAncestor] = true)
        }
        return acc
      }, {});

        const compiledContents = [
          templateIntro,
          `function createStateMachine(fsmDefForCompile, settings) {`,
          `const actions = fsmDefForCompile.actionFactories;`,
          `actions["ACTION_IDENTITY"] = function(){return {updates:{}, outputs:[]}}`,
          `const guards = fsmDefForCompile.guards;`,
          `const updateState = fsmDefForCompile.updateState;`,
          `const initialControlState = INIT_STATE`,
          `const initialExtendedState = fsmDefForCompile.initialExtendedState;`,
          ``,
          `// initialize`,
          `let stateAncestors = ${JSON.stringify(stateAncestors)};`,
          `let isStateWithEventlessTransition = ${JSON.stringify(isStateWithEventlessTransition)}`,
          `let isCompoundControlState = ${JSON.stringify(isCompoundControlState)}`,
          `let cs = initialControlState;`,
          `let es = initialExtendedState;`,
          `let hs = ${JSON.stringify(initialHistoryState)}`,
          ``,
          `const eventHandlers = {`,
          Object.keys(transitionsPerOrigin).reduce((str, from) => {
            return str + [
              // From
              `"${from}": {`,
              // Event
              Object.keys(transitionsPerOrigin[from]).reduce((str, event) => {
                const stateAncestorsWithHandler = stateAncestors[from] && stateAncestors[from].filter(ancestor => transitions.some(({ from, e }) => from === ancestor && event === e));
                const transition = transitionsPerOrigin[from][event];
                const { guards, to, action } = transition;

                return str +
                  `${JSON.stringify(event)}:  ${!guards
                    ? transitionWithoutGuard(action, to)
                    : [
                      `function (es, ed, stg){`,
                      `let computed = null;`,
                      guards.map(({ predicate, to, action }, index) => {
                        return `${index ? 'else if' : 'if'} (guards["${predicate.slice(3, -3)}"](es, ed, stg)) {computed =  actions["${action.slice(3, -3)}"](es, ed, stg); cs = ${resolve(to)};}`;
                      }).join('\n'),
                      `if (computed !== null) {
                      es = updateState(es, computed.updates);
                      hs = updateHistoryState(hs, stateAncestors, cs);
                  }
                    return computed
                  `,
                      `},`,
                    ].join('\n')}`;
              }, ''),
              // End from
              `},`,
            ].join('\n');
          }, ''),
          // End event handler : {
          `}`,
          ``,
          // NOw the main function
          mainLoop,
          `}`,
        ].join('\n ').trim();

        return compiledContents;
      })
        .flatMap(compiledContents => Try.of(() => {
          // Write the esm output file
          const esmContents = [compiledContents, esmExports].join("\n\n");
            const prettyEsmFileContents = prettier.format(esmContents , { semi: true, parser: 'babel', printWidth: 120 });
            fs.writeFileSync(`${file}.fsm.compiled.js`, prettyEsmFileContents );
          // Write the cjs output file
          const cjsContents = [compiledContents, cjsExports].join("\n\n");
            const prettyCjsFileContents = prettier.format(cjsContents, { semi: true, parser: 'babel', printWidth: 120 });
            fs.writeFileSync(`${file}.fsm.compiled.cjs`, prettyCjsFileContents );
          },
        )),
    );

  return result.fold(
    error => {
      console.error(error);
      process.exit(1);
    },
    result => {
      // console.log(`template:`, result);
    },
  );
}


// TODO: optimize later
// remove historyMaps if no use of history