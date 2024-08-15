import React from 'react';

/**
 * a map contains all custom React components, keeping this as react-com internal state
 */
const componentsFactory = {};

function parseStringRef(str, refArgs) {
  if (typeof str === 'string' && str.startsWith('$')) {
    return str.substr(1).split('.').reduce((accu, token) => accu[token], refArgs); // eg. arguments[1]['actions']['addTodo']
  } else {
    return str;
  }
}

/**
 * This is the functionality to map an JS object to React components tree
 * @param {object} jsonObj - a plain JS described by primitives, which is losslessly serializabled to JSON format
 * @param {array} arguments - js function arguments, to handle extra arguments. eg. $0 is jsonOjb, $1 is props
 * @example App = ({todos, actions}) => hydrate(appJson, {todos, actions});
 */
export function hydrate(jsonObj, ...restArgs) {
  if (Array.isArray(jsonObj)) {  // in case of indexed childe components (array of array in jsonObj)
    return jsonObj.map(obj => hydrate(obj, ...restArgs)); // breaks $0
  }
  let type, props = {}, children = [];
  Object.keys(jsonObj).forEach((key) => {
    let value = jsonObj[key];
    switch (key) {
      case '$type':      // hydrate type
        type = componentsFactory[value] || value; // assume user does NOT override React-dom components like 'div'
        break;
      case '$children':  // hydrate children
        children = parseStringRef(value, [jsonObj, ...restArgs]);
        break;
      default:           // hydrate props
        props[key] = parseStringRef(value, [jsonObj, ...restArgs]);
    }
  });
  if (!type) { throw new Error('failed to review/hydrate React COM: type must be defined with \'$type\'!'); } // or we could default '$type=\'div\''?
  if (!children || children.length === 0) { // cover both empty string or empty array
    return React.createElement(
      type,
      props,
      null
    )
  } if (typeof children === 'string') {
    return React.createElement(
      type,
      props,
      children
    )
  } else {
    return React.createElement(
      type,
      props,
      ...children.map(childJsonObj => hydrate(childJsonObj, ...restArgs)) // breaks $0
    )
  }
}

export function register(components) {
  if (typeof components === 'object') {
    Object.keys(components).forEach(key =>{
      componentsFactory[key] = components[key];
    })
  } else {
    throw new Error('not supported components type in reac-com.register');
  }
}

export default {
  hydrate,
  register
}
