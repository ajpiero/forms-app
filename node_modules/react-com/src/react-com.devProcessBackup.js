import React from 'react';

/**
 * This is the functionality to map an JS object to React components tree
 * @param {object} jsonObj - a plain JS described by primitives, which is losslessly serializabled to JSON format
 * @param {object} componentsFactory - a map contains all custom React components
 * @param {array} argumentsContext - similar to js function arguments, TODO: try pass this from scope?
 */
export function hydrate(jsonObj, componentsFactory, argunemtsContext) {
  const { $type, $children, ...$props } = jsonObj;
  // hydrate type
  if (!$type) { throw new Error('failed to review React COM: type must be defined with \'$type\'!'); } // or we could default '$type=\'div\''?
  let type = componentsFactory[$type] || $type; // user should not override React-dom components like 'div'
  // hydrate props
  let props = {};
  Object.keys($props).forEach((key) => { //get referenced props from arguments
    let value = $props[key];
    // console.log(argunemtsContext);  //want this to be returned arguments as {todos, actions}
    if (typeof value === 'string' && value.startsWith('$')) {
      props[key] = value.substr(1).split('.').reduce((accu, token) => accu[token], argunemtsContext); // eg. arguments[0]['actions']['addTodo']
    } else {
      props[key] = value;
    }
  });
  // hydrate children
  let children;
  if (!$children) {
    return React.createElement(
      type,
      props,
      null
    )
  } else if ($children === 'string') {
    return React.createElement(
      type,
      props,
      $children
    )
  } else if (Array.isArray($children) && $children.length !== 0) {
    children = $children.map(function(childJsonObj) {
      return hydrate(childJsonObj, componentsFactory, argunemtsContext);
    });
    return React.createElement(
      type,
      props,
      ...children  // passing just as array would trigger React requiring props.key
    )
  } else {
    throw new Error(`failed to review React COM: unsupported "$children" type: "${typeof $children}"`)
  }
}

//3rd: revive properties
export function hydateDummyWithArgs(jsonObj, factory) {
  return function() {  // can't use arrow function as we need arguments[0] to get todos and actions
    // NOTE: notics children need fixed scope to access todos/actions
    let children = [React.createElement(
      factory['Header'],
      { addTodo: arguments[0].actions.addTodo }
    ), React.createElement(
      factory['MainSection'],
      { todos: arguments[0].todos, actions: arguments[0].actions }
    )];
    return React.createElement(
      'div',
      null,
      ...children
    )
  }
}

//2nd
export function hydateDummy(jsonObj, factory) {
  return function({ todos, actions }) {
    // NOTE: notics children need fixed scope to access todos/actions
    let children = [React.createElement(
      factory['Header'],
      { addTodo: actions.addTodo }
    ), React.createElement(
      factory['MainSection'],
      { todos: todos, actions: actions }
    )];
    return React.createElement(
      'div',
      null,
      ...children
    )
  }
}

//1st
export function dummy({todos, actions}) {
  return (
    <div>
      <Header addTodo={actions.addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  )
}
