import React, { useState } from 'react';
import { OnboardingStage, OwnerOnboarding } from '@/types/onboarding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface OnboardingProgressSidebarProps {
  currentStageId: string;
  currentStepId: string;
}

const OnboardingProgressSidebar: React.FC<OnboardingProgressSidebarProps> = ({ currentStageId, currentStepId }) => {
  const [expandedStages, setExpandedStages] = useState<string[]>([currentStageId]);

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev =>
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  return (
    <div className="p-4 w-64">
      <h2 className="text-xl font-bold mb-4">Onboarding Progress</h2>
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        {OwnerOnboarding.stages.map((stage: OnboardingStage, stageIndex) => {
          const isStageCompleted = stageIndex < OwnerOnboarding.stages.findIndex(s => s.id === currentStageId);
          const isCurrentStage = stage.id === currentStageId;
          const isExpanded = expandedStages.includes(stage.id);

          return (
            <div key={stage.id} className="mb-4 relative">
              <div 
                className="flex items-center mb-2 cursor-pointer" 
                onClick={() => toggleStage(stage.id)}
              >
                <div className="absolute left-0 w-4 h-4 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={isStageCompleted ? faCheckCircle : faCircle}
                    className={`text-lg ${isStageCompleted ? 'text-green-500' : isCurrentStage ? 'text-blue-500' : 'text-gray-400'}`}
                  />
                </div>
                <h3 className="text-lg font-semibold ml-8">{stage.title}</h3>
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronDown : faChevronRight}
                  className="ml-auto text-gray-400"
                />
              </div>
              {isExpanded && (
                <ul>
                  {stage.steps.map((step, stepIndex) => {
                    const isCompleted = isStageCompleted || (isCurrentStage && stepIndex <= stage.steps.findIndex(s => s.id === currentStepId));
                    return (
                      <li key={step.id} className="flex items-center mb-2 relative">
                        <div className="absolute left-0 w-4 h-4 flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={isCompleted ? faCheckCircle : faCircle}
                            className={`text-sm ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}
                          />
                        </div>
                        <span className={`ml-8 text-sm ${isCompleted ? 'font-medium' : ''}`}>{step.title}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgressSidebar;
