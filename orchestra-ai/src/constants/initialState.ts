export const initialState = {
    stateVersion: "1",
    projectView: {
      name: '',
      description: '',
      language: '',
      framework: '',
      tools: [],
      aiModel: '',
      codingStandards: ''
    },
    settingsView: {
      standards: {}
    },
    testView: {
      tests: []
    },
    taskView: {
      tasks: []
    }
    // Add any other initial state properties here
  };
  
  export type StateShape = typeof initialState;