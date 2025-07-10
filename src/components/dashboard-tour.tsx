
"use client"

import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

export const DashboardTour = () => {
  const [run, setRun] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const hasSeenTour = localStorage.getItem('cloakdash_tour_seen');
      if (!hasSeenTour) {
        // Use a timeout to ensure the DOM is ready for Joyride to find the targets
        setTimeout(() => {
          setRun(true);
        }, 100);
      }
    }
  }, [isMounted]);

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
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem('cloakdash_tour_seen', 'true');
      setRun(false);
    }
  };

  if (!isMounted) {
    return null;
  }

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
          arrowColor: 'hsl(var(--card))',
          backgroundColor: 'hsl(var(--card))',
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--card-foreground))',
          zIndex: 1000,
        },
        buttonClose: {
            color: 'hsl(var(--card-foreground))'
        },
        buttonNext: {
            backgroundColor: 'hsl(var(--primary))',
        },
        buttonBack: {
            color: 'hsl(var(--primary))'
        },
        spotlight: {
          borderRadius: 'var(--radius)'
        }
      }}
    />
  );
};
