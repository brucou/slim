# Kingly compiler specifications

## How to use
- should be a CLI which receives a yed file and returns a JS file, like yed2Kingly (yed2js would be a good name)
- the js file exports a curried function which misses action and guards, and settings to return the machine
- in  first version the compile code need to be optimal (whether size-wise or performnance-wise)
- could be used maybe with a macro which ecompile the machine automatiquement for prod.
- that could be done with a label yed.filename: const fsm = createStateMachine({action, guards}, settings)

## Exploration algorithm
- fsm : {transitions, events, states}
- transition :: [{from, event, to, action} || {from, event, guards: {predicate, to, action}}]
  - event can be null (eventless transitions)
  - to can be object (history states)
  
const eventHandlers = new DoubleEntryMap();
let cs = initialControlState;
let es = initialExtendedState;
let hs = initialHistoryState;
let machineState = {cs, es, hs};

for (transition t <- {event e, from}):
  - eventHandlers[from][e] = case of
       no guards: action
       guards: (es, ed, stg) => evaluateLocalTransition (es, ed, sg);
       
       where evaluateLocalTransition = (es, ed, stg) => guardRecords.forEach({predicate, to, action} => { 
         predicate(es, ed, stg) ? action(es, ed, stg), break : null
       }) 
       -- returns null if no guards fulfilled
       -- returns {updates, outputs} if one guard fulfills

main loop:
fsm e = first: 
          case of evaluateTransitions es ed stg
            null: -- no transitions at all found in the whole hierarchy
              {cs, es, hs} <- same
            {updates, outputs}: {cs <- resolve(to), es <- updateState(es, updates), hs <- updateHistory(cs, to)} <-
        then:
          case of:
            cs compoundState: aggregate(outputs, fsm {init: ed} ) -- nothing to replace, already configured with init
            eventless transition: aggregate(outputs, fsm {auto: ed} ) -- replace eventless ("") by auto et rien a faire
-- miss cases eventless and compound states, cad automatic transitions
          
       where evaluateTransitions = (es, ed, stg) => case of eventHandlers[cs][el](es, ed, stg)
         null: -- pas de transitions a ce niveau pour cet event, regarder plus haut dans la hierarchie
          - evaluate the first up in hierarchy which has transitions {from, e}
          - null -> loop if there is another 
                         else null
         not null: eventHandlers[cs][el](es, ed, stg)
         
    
   
   where e = (el, ed)
