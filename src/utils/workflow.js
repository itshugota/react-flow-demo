export const getScriptListFromWorkflow = async workflow =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(workflow.listScript);
    }, Math.random() * 5000),
  );
