 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';

const stages = [
  'Project Setup',
  'Test Creation',
  'Code Implementation',
  'Linting',
  'Code Review',
  'Refactoring'
];

const stageDescriptions = [
  'Setting up the project structure and initial configurations.',
  'Creating test cases based on project requirements.',
  'Implementing the code to pass the created tests.',
  'Running linters to ensure code quality and adherence to standards.',
  'Reviewing the implemented code for potential improvements.',
  'Refactoring the code to improve its structure and efficiency.'
];

const ProgressBar = ({ progress }) => (
  <div className="mb-4">
    <h5>Progress</h5>
    <div className="progress">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {progress}%
      </div>
    </div>
  </div>
);

const ControlButtons = ({
  onNext,
  onReplay,
  onPause,
  onFixTest,
  onManualIntervention,
  isPaused,
  isManualMode,
  isLastStage,
  isLoading
}) => (
  <div className="d-flex flex-wrap gap-2 mb-4">
    <button
      className="btn btn-primary"
      onClick={onNext}
      disabled={isLastStage || isLoading}
    >
      Next
    </button>
    <button className="btn btn-secondary" onClick={onReplay} disabled={isLoading}>
      Replay
    </button>
    <button
      className={`btn ${isPaused ? 'btn-success' : 'btn-warning'}`}
      onClick={onPause}
      disabled={isLoading}
    >
      {isPaused ? 'Resume' : 'Pause'}
    </button>
    <button className="btn btn-info" onClick={onFixTest} disabled={isLoading}>
      {isLoading ? 'Fixing...' : 'Fix Test'}
    </button>
    <button
      className={`btn ${isManualMode ? 'btn-danger' : 'btn-outline-danger'}`}
      onClick={onManualIntervention}
      disabled={isLoading}
    >
      {isManualMode ? 'Exit Manual Mode' : 'Manual Intervention'}
    </button>
  </div>
);

const OrchestratorControlView = () => {
  
  const [orchestratorState, updateOrchestratorState] = useSharedContext('orchestratorView');
  const {
    currentStage,
    tasks,
    isPaused,
    isManualMode,
    error
  } = orchestratorState || {
    currentStage: 0,
    tasks: [],
    isPaused: false,
    isManualMode: false,
    error: null
  };

  const calculateProgress = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100) || 0;
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      updateOrchestratorState(prevState => ({
        ...prevState,
        currentStage: prevState.currentStage + 1,
        tasks: [], // Reset tasks for the new stage
        error: null
      }));
    } else {
      updateOrchestratorState(prevState => ({
        ...prevState,
        error: 'Already at the final stage'
      }));
    }
  };

  const handleReplay = () => {
    updateOrchestratorState(prevState => ({
      ...prevState,
      tasks: prevState.tasks.map(task => ({ ...task, completed: false })),
      error: null
    }));
  };

  const handlePause = () => {
    updateOrchestratorState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused,
      error: null
    }));
  };

  const handleFixTest = () => {
    console.log('Instructing AI to fix failing test');
    // Simulating an async operation
    updateOrchestratorState(prevState => ({ ...prevState, isLoading: true }));
    setTimeout(() => {
      updateOrchestratorState(prevState => ({ ...prevState, isLoading: false }));
    }, 2000);
  };

  const handleManualIntervention = () => {
    updateOrchestratorState(prevState => ({
      ...prevState,
      isManualMode: !prevState.isManualMode,
      error: null
    }));
  };

  return (
    <div className="orchestrator-control-view container mt-4">
      <h2 className="mb-4">Orchestrator Control</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Current Stage</h5>
          <p className="card-text">{stages[currentStage]}</p>
          <small className="text-muted">{stageDescriptions[currentStage]}</small>
        </div>
      </div>

      <ProgressBar progress={calculateProgress()} />

      <ControlButtons
        onNext={handleNext}
        onReplay={handleReplay}
        onPause={handlePause}
        onFixTest={handleFixTest}
        onManualIntervention={handleManualIntervention}
        isPaused={isPaused}
        isManualMode={isManualMode}
        isLastStage={currentStage === stages.length - 1}
        isLoading={orchestratorState?.isLoading}
      />

      {isManualMode && (
        <div className="alert alert-info mt-3" role="alert">
          Manual Intervention Mode: You can now manually write code or tests. Click 'Exit Manual Mode' when finished.
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default OrchestratorControlView;