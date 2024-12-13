import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout';
import NavBar from '@/components/common/NavBar';
import OnboardingProgressSidebar from '@/components/onboarding/OnboardingProgressSidebar';
import { OwnerOnboarding } from '@/types/onboarding';
import { SmallHero } from '@/components/common/Hero';
import Button from '@/components/common/Button';

const OwnerOnboardingPage: React.FC = () => {
  const [currentStageId, setCurrentStageId] = useState(OwnerOnboarding.stages[0].id);
  const [currentStepId, setCurrentStepId] = useState(OwnerOnboarding.stages[0].steps[0].id);


  // useEffect(() => {
  //   setCurrentStageId('add-dataset');
  //   setCurrentStepId('data-commitment');
  // }, [currentStageId, currentStepId]);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <Layout>
        <div className="flex">
          <div className="w-64 fixed h-full overflow-auto top-40">
            <OnboardingProgressSidebar
              currentStageId={currentStageId}
              currentStepId={currentStepId}
            />
          </div>
          <div className="flex-1 ml-64 px-8 mt-32">
            <div className="p-6 rounded-lg flex flex-col gap-8">
              <h2 className="text-2xl font-semibold mb-4">
                {OwnerOnboarding.stages.find(stage => stage.id === currentStageId)?.steps.find(step => step.id === currentStepId)?.title}
              </h2>
              <div className="flex flex-col gap-4">
                {OwnerOnboarding.stages.find(stage => stage.id === currentStageId)?.steps.find(step => step.id === currentStepId)?.content}
              </div>
              {OwnerOnboarding.stages.find(stage => stage.id === currentStageId)?.steps.find(step => step.id === currentStepId)?.cta && (
                <div className="flex justify-start">
                  <Button
                    onClick={() => {
                      const currentStage = OwnerOnboarding.stages.find(stage => stage.id === currentStageId);
                      const currentStep = currentStage?.steps.find(step => step.id === currentStepId);
                      
                      // Execute onClick if it exists
                      if (currentStep?.cta?.onClick) {
                        currentStep.cta.onClick();
                      }

                      // Handle navigation
                      const currentStepIndex = currentStage?.steps.findIndex(step => step.id === currentStepId) ?? -1;
                      if (currentStepIndex < (currentStage?.steps.length ?? 0) - 1) {
                        // Move to next step in current stage
                        setCurrentStepId(currentStage?.steps[currentStepIndex + 1].id ?? '');
                      } else {
                        // Move to next stage
                        const currentStageIndex = OwnerOnboarding.stages.findIndex(stage => stage.id === currentStageId);
                        if (currentStageIndex < OwnerOnboarding.stages.length - 1) {
                          setCurrentStageId(OwnerOnboarding.stages[currentStageIndex + 1].id);
                          setCurrentStepId(OwnerOnboarding.stages[currentStageIndex + 1].steps[0].id);
                        }
                      }
                    }}
                  ><span className="font-bold">{OwnerOnboarding.stages.find(stage => stage.id === currentStageId)?.steps.find(step => step.id === currentStepId)?.cta?.label}</span></Button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default OwnerOnboardingPage;
