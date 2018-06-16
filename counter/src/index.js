import hh from 'hyperscript-helpers';
import { h, diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';

const { div, button } = hh(h);

const initModel = 0;

function view(dispatch, model) {

    return div([

        div({ className: 'mv2' }, `Count: ${model}`),

        button({ 
            className: 'pv1 ph2 mr2',
            onclick: () => dispatch(MSGS.ADD)
        }, '+'),

        button({ 
            className: 'pv1 ph2',
            onclick: () => dispatch(MSGS.SUBTRACT)
        }, '-')

    ])
}

const MSGS = {
    ADD: 'ADD',
    SUBTRACT: 'SUBTRACT'
}

function update(msg, model) {
    switch (msg) {
        case MSGS.ADD:
            return model + 1;
        break;
        case MSGS.SUBTRACT:
            return model - 1;
        break;
        deault: return model;
    }
}

// impure code below
function app(initModel, update, view, node) {
    let model = initModel;
    // Creating virtual DOM elements (div></div>)
    // the dispatch function below is made publically accessible to the view function here, and attached to the onclick event of +/- buttons
    let currentView = view(dispatch, model);
    // Create initial root DOM node
    let rootNode = createElement(currentView);
    // Appending virtual DOM elements to actual DOM
    node.appendChild(rootNode);

    function dispatch(msg) {
        // model is accessible here via a closure over the app function (let model)
        model = update(msg, model);
        // re-passing in dispatch function (with new model variable values) to the view function to be attached to onclick handlers
        const updatedView = view(dispatch, model);
        // Find the difference between old view and updated view
        const patches = diff(currentView, updatedView);
        // Update the patches within the rootNode (i.e. the elements that have changed)
        rootNode = patch(rootNode, patches);
        // Assign the updated view virtual DOM element to the currentView variable; 
        currentView = updatedView;
    }
}


const rootNode = document.getElementById('app');

app(initModel, update, view, rootNode);

// rootNode.appendChild(view(update('plus', initModel)));