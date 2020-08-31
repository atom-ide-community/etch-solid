import { createState, createRoot, produce } from "solid-js";

// etch.initialize
export function initialize(component) {

  const $originUpdate = component.update,
    $originDestroy = component.destroy;

  // handle the changes in the states
  let dispose;
  const d = Object.getOwnPropertyDescriptors(component.__proto__);
  const [$state, setState] = createState(
    Object.assign(Object.create(Object.prototype, d), component)
  );

  // handle updating
  function update(...args) {
    setState(produce((s) => $originUpdate.call(s, ...args)));
  }

  // handle destroying
  function destroy() {
    $originDestroy && $originDestroy.call($state);
    dispose();
  }


  // add update, destroy, and setState to the component
  Object.assign(component, { update, destroy, setState });

  // element property
  createRoot((disposer) => {
    dispose = disposer;
    component.element = component.render.call($state);
  });
}