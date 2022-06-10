export function factory(settings) {
  let instance = new Reactish(settings);
  return {setState: instance.setState.bind(instance)};
}

class Reactish {
  constructor({components, actions}) {
    this.state = {};
    this.components = components;
    this.actions = actions;

    // TODO  multiple action handlerssupport
    window.action = (event, actionName, ...rest) => {
      if (actionName in this.actions === false) {
        console.error(`Unsupported action [${actionName}]`);
        return;
      }
      this.actions[actionName](event, ...rest);
    };
  }

  setState(getNewState, callback) {
    setTimeout(() => {
      this.state = {...this.state, ...getNewState(this.state)};
      this.render(this.state, callback);
    });
  }

  render(state, callback) {
    document.querySelectorAll('[data-component]').forEach(el => {
      el.innerHTML = this.components[el.dataset.component](state);
    });
    callback(state);
  }
}