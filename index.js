module.exports = function slim(argv) {
  const { Try, TryModule, Success, Failure, None, Some, Left, Right } = require('funfix');
  const { initHistoryDataStructure, computeHistoryMaps, ACTION_IDENTITY, INIT_EVENT, INIT_STATE } = require('kingly');
  const { templateIntro, transitionWithoutGuard, mainLoop, cjsExports, esmExports } = require('./templates');
  const prettier = require('prettier'); // From jest: terrific to format object nicely
  const fs = require('fs');
  const { Command } = require('commander');
  const { computeTransitionsAndStatesFromXmlString } = require('./conversion');
  const { checkKinglyContracts, resolve, computeParentMapFromHistoryMaps, getCommentsHeader, frontHeader } = require('./helpers');
  const program = new Command();

// Configure syntax, parse and run
  program
    .version('0.1.0')
    .arguments('<file>')
    .action(compileYedFile);
  program.parse(process.argv);

// Conversion function
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
            console.error(isValid);
            throw new Error(`The input graph does not represent a valid Kingly machine! Cf. log.`);
          }

          // So we read the file, we have our transitions, states and events for a valid graph,
          // let's compile
          const historyMaps = computeHistoryMaps(states);
          const initialHistoryState = initHistoryDataStructure(historyMaps.stateList);
          const stateAncestors = historyMaps.stateAncestors;
          const parentMap = computeParentMapFromHistoryMaps(historyMaps);
          const transitions = transitionsWithoutGuardsActions;
          const transitionsPerOrigin = transitions.reduce((acc, transition) => {
            const { from, event } = transition;
            acc[from] = acc[from] || {};
            acc[from][event] = transition;
            return acc;
          }, {});
          const isStateWithEventlessTransition = transitions.reduce((isStateWithEventlessTransition, transition) => {
            const { from, event } = transition;
            if (event === '') {
              isStateWithEventlessTransition[from] = true;
            }
            ;

            return isStateWithEventlessTransition;
          }, {});
          const isCompoundControlState = historyMaps.stateList.reduce((acc, state) => {
            if (stateAncestors && stateAncestors[state]) {
              stateAncestors[state].forEach(stateAncestor => acc[stateAncestor] = true);
            }
            return acc;
          }, {});
          const nextEventMap = historyMaps.stateList.reduce((acc, state) => {
            if (isStateWithEventlessTransition[state]) {
              acc[state] = '';
            }
            else if (isCompoundControlState[state]) {
              acc[state] = INIT_EVENT;
            }
            return acc;
          }, {});
          const usesHistoryStates = Object.keys(isCompoundControlState).length > 0 && transitions.some(transition => {
            if (transition.guards) return transition.guards.some(({ to }) => typeof to === 'object');
            else return typeof transition.to === 'object';
          });
          // The usesHistoryStates guard is important as transitioning to an
          // history pseudo state may lead to a transition to a compound state,
          // hence we have an hidden automatic transition here
          //  NOTE: while being false does not mean that there is an automatic event
          // being false means that there is none such event
          const hasAutomaticEvents = usesHistoryStates || Object.keys(nextEventMap).some(state => nextEventMap[state] != null);

          // Start the compiled file with the shape of actions and guards
          // to pass to the `createStateMachine` factory function
          const commentsHeader = getCommentsHeader(transitionsWithoutGuardsActions);

          const compiledContents = [
            frontHeader,
            commentsHeader,
            templateIntro(usesHistoryStates, hasAutomaticEvents, nextEventMap),
            `function createStateMachine(fsmDefForCompile, stg) {`,
            `var actions = fsmDefForCompile.actionFactories;`,
            `var guards = fsmDefForCompile.guards;`,
            `var updateState = fsmDefForCompile.updateState;`,
            `var initialExtendedState = fsmDefForCompile.initialExtendedState;`,
            ``,

            Object.keys(stateAncestors).length === 0 ? `
            // Initialize machine state,
            `.trim() : `
            // Initialize machine state,
            var parentMap = ${JSON.stringify(parentMap)};
            `.trim(),
            `var cs = ${JSON.stringify(INIT_STATE)};`,
            `var es = initialExtendedState;`,
            usesHistoryStates ? `var hs = ${JSON.stringify(initialHistoryState)};\n` : ``,
            Object.keys(stateAncestors).length !== 0 ? `
            function getAncestors(cs) {return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : []} ;
            ` : '',
            `var eventHandlers = {`,
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
                      ? transitionWithoutGuard(action, to, usesHistoryStates)
                      : [
                        `function (es, ed, stg){`,
                        `let computed = null;`,
                        guards.map(({ predicate, to, action }, index) => {
                          const actionName = action.slice(3, -3);
                          if (actionName === 'ACTION_IDENTITY') {
                            const computed = ACTION_IDENTITY();
                            return `${index ? 'else if' : 'if'} (guards["${predicate.slice(3, -3)}"](es, ed, stg)) {computed =  ${JSON.stringify(computed)}; cs = ${resolve(to)};}`;
                          }
                          else {
                            return `${index ? 'else if' : 'if'} (guards["${predicate.slice(3, -3)}"](es, ed, stg)) {computed =  actions["${action.slice(3, -3)}"](es, ed, stg); cs = ${resolve(to)};}`;
                          }
                        }).join('\n'),
                        `if (computed !== null) {
                      es = updateState(es, computed.updates);`,
                        usesHistoryStates && `hs = updateHistoryState(hs, getAncestors, cs);` || '',
                        `                  }
                        
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
            // Now the main function
            mainLoop(nextEventMap, hasAutomaticEvents, stateAncestors),
            `}`,
          ].join('\n ').trim();

          return compiledContents;
        })
          .flatMap(compiledContents => Try.of(() => {
              // Write the esm output file
              const esmContents = [compiledContents, esmExports].join('\n\n');
              const prettyEsmFileContents = prettier.format(esmContents, { semi: true, parser: 'babel', printWidth: 120 });
              fs.writeFileSync(`${file}.fsm.compiled.js`, prettyEsmFileContents);
              // Write the cjs output file
              const cjsContents = [compiledContents, cjsExports, ''].join('\n\n');
              const prettyCjsFileContents = prettier.format(cjsContents, { semi: true, parser: 'babel', printWidth: 120 });
              fs.writeFileSync(`${file}.fsm.compiled.cjs`, prettyCjsFileContents);
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

// TODO: cf. TODO.md
};


