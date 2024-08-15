//test props spreading and referencing back to arguments

const argunemtsContext = JSON.parse('[{"todos":[{"text":"Use Redux","completed":false,"id":0}],"actions":{}}]');
const $props = {
  todos: '$0.todos',
  actions: '$0.actions'
};

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

expect({
  {
    todos: 'arguments[0].todos',
    actions: 'arguments[0].actions'
  }
})
