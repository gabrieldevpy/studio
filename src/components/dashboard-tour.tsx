"use client"

import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

export const DashboardTour = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('cloakdash_tour_seen');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Bem-vindo ao CloakDash! Vamos fazer um tour rápido.',
      placement: 'center',
    },
    {
      target: '#tour-step-1',
      content: 'Este é o seu painel, onde você pode ver e gerenciar todas as suas rotas de cloaking.',
      placement: 'bottom',
    },
    {
      target: '#tour-step-2',
      content: 'Para começar, clique aqui para criar sua primeira rota. É rápido e fácil!',
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem('cloakdash_tour_seen', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Fim',
        next: 'Próximo',
        skip: 'Pular',
      }}
      styles={{
        options: {
          arrowColor: '#1A1A1A',
          backgroundColor: '#1A1A1A',
          primaryColor: '#FB4C6E',
          textColor: '#FFFFFF',
          zIndex: 1000,
        },
        buttonClose: {
            color: '#FFFFFF'
        },
        buttonNext: {
            backgroundColor: '#FB4C6E',
        },
        buttonBack: {
            color: '#FB4C6E'
        }
      }}
    />
  );
};
