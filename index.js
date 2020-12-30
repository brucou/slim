module.exports = function slim(argv) {
  const { Try, TryModule, Success, Failure, None, Some, Left, Right } = require('funfix');
  const { initHistoryDataStructure, computeHistoryMaps, ACTION_IDENTITY, INIT_EVENT, INIT_STATE } = require('kingly');
  const { templateIntro, transitionWithoutGuard, transitionWithGuards, mainLoop, cjsExports, esmExports } = require('./templates');
  const prettier = require('prettier'); // From jest: terrific to format object nicely
  const fs = require('fs');
  const { Command } = require('commander');
  const { computeTransitionsAndStatesFromXmlString } = require('./conversion');
  const { checkKinglyContracts, isTransitionWithoutGuard, getIndexedHistoryStates, computeParentMapFromHistoryMaps, getCommentsHeader, frontHeader } = require('./helpers');
  const program = new Command();
  const prettyFormat = require('pretty-format');

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

    // console.warn(`\nfile`, file)
    const result = readFile(file)
      .flatMap(compileYedString)
      .flatMap(writeCompiledFiles(file));

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

  function compileYedString(yedString) {
    return Try.of(() => {
      const {
        states,
        stateYed2KinglyMap,
        events,
        transitionsWithoutGuardsActions,
        // only exists to check if machine is valid Kingly machine
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
      const stateListWithNok = [INIT_STATE].concat(historyMaps.stateList);
      const stateIndexList = stateListWithNok.reduce((acc, cs, i) => (acc[cs] = i, acc), {});
      const initialHistoryStateKingly = initHistoryDataStructure(historyMaps.stateList);
      const initialHistoryState = getIndexedHistoryStates(initialHistoryStateKingly, stateListWithNok);
      const stateAncestors = historyMaps.stateAncestors;
      const parentMap = computeParentMapFromHistoryMaps(historyMaps, stateIndexList, stateListWithNok);
      const transitions = transitionsWithoutGuardsActions;
      // console.warn(`transitions `, prettyFormat(transitions ))
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
      const nextEventMap = stateListWithNok.map(cs => {
        if (isStateWithEventlessTransition[cs]) {
          return '';
        }
        else if (isCompoundControlState[cs]) {
          return INIT_EVENT;
        }
        return -1;

      });
      const usesHistoryStates = Object.keys(isCompoundControlState).length > 0 && transitions.some(transition => {
        if (transition.guards) return transition.guards.some(({ to }) => typeof to === 'object');
        else return typeof transition.to === 'object';
      });
      // The usesHistoryStates guard is important as transitioning to an
      // history pseudo state may lead to a transition to a compound state,
      // hence we have an hidden automatic transition here
      //  NOTE: while being false does not mean that there is an automatic event
      // being false means that there is none such event
      const hasAutomaticEvents = usesHistoryStates || Object.keys(nextEventMap).some(state => nextEventMap[state] === '' || nextEventMap[state] === INIT_EVENT);
      const hasChainedActions = transitions.some(transition => {
        const guards = transition.guards;
        return guards.some(g => g.action.filter(Boolean).length > 1);
      });

      // Start the compiled file with the shape of actions and guards
      // to pass to the `createStateMachine` factory function
      const commentsHeader = getCommentsHeader(transitionsWithoutGuardsActions, stateListWithNok);

      const compiledContents = [
        frontHeader,
        commentsHeader,
        templateIntro({ usesHistoryStates, hasAutomaticEvents, nextEventMap, hasChainedActions }),
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
        // We use the conrol state index, i.e. a number, not the full string to save bytes
        `// Start with pre-initial state ${JSON.stringify(INIT_STATE)}`,
        `var cs = ${JSON.stringify(stateIndexList[INIT_STATE])};`,
        `var es = initialExtendedState;`,
        usesHistoryStates ? `var hs = ${JSON.stringify(initialHistoryState)};\n` : ``,
        Object.keys(stateAncestors).length !== 0 ? `
            function getAncestors(cs) {return parentMap[cs] ? [parentMap[cs]].concat(getAncestors(parentMap[cs])) : []} ;
            ` : '',
        eventHandlers({
          transitions,
          transitionsPerOrigin,
          stateAncestors,
          usesHistoryStates,
          stateListWithNok,
          stateIndexList,
        }),
        // Now the main function
        mainLoop({ nextEventMap, hasAutomaticEvents, stateAncestors }),
        `}`,
      ].join('\n ').trim();

      return compiledContents;
    });
  }

  function readFile(file) {
    return Try.of(() => fs.readFileSync(file, 'utf8'));
  }

  function writeCompiledFiles(file) {
    return compiledContents => Try.of(() => {
      // Write the esm output file
      const esmContents = [compiledContents, esmExports].join('\n\n');
      const prettyEsmFileContents = prettier.format(esmContents, { semi: true, parser: 'babel', printWidth: 120 });
      // const prettyEsmFileContents = esmContents;
      fs.writeFileSync(`${file}.fsm.compiled.js`, prettyEsmFileContents);
      // Write the cjs output file
      const cjsContents = [compiledContents, cjsExports, ''].join('\n\n');
      const prettyCjsFileContents = prettier.format(cjsContents, { semi: true, parser: 'babel', printWidth: 120 });
      fs.writeFileSync(`${file}.fsm.compiled.cjs`, prettyCjsFileContents);
    });
  }

  function eventHandlers({ transitions, transitionsPerOrigin, stateAncestors, usesHistoryStates, stateListWithNok, stateIndexList }) {
    const eventHandlers = stateListWithNok.map(cs => {
      const transitionRecord = transitionsPerOrigin[cs];
      if (transitionRecord) {
        const events = Object.keys(transitionRecord);
        return `{` +
          events.reduce((str, event) => {
            const transition = transitionsPerOrigin[cs][event];
            const { guards } = transition;
            // console.warn(`transition`, transition)

            return str + `
            ${JSON.stringify(event)}:  ${
              isTransitionWithoutGuard(guards)
                ? transitionWithoutGuard(guards[0].action, guards[0].to, usesHistoryStates, stateIndexList)
                : transitionWithGuards(guards, usesHistoryStates, stateIndexList)
              }
          `;
          }, '') +
          `}`;
      }
      else {
        return null;
      }
    });

    return `var eventHandlers = [${eventHandlers.join()}]
      `;
  }

// TODO: cf. TODO.md
};


