
"use client";

import React, { useEffect, useState } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';

export const DashboardTour = () => {
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if the tour has been run before
    if (typeof window !== 'undefined' && !localStorage.getItem('cloakdash-tour-v1')) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark the tour as completed
      localStorage.setItem('cloakdash-tour-v1', 'true');
      setRun(false);
    }
  };

  const tourSteps: Step[] = [
    {
      target: '#tour-step-1',
      content: 'Bem-vindo ao seu Painel! Aqui você tem uma visão geral de suas operações.',
      placement: 'bottom',
    },
    {
      target: '#tour-step-2',
      content: 'Clique aqui para criar sua primeira rota de cloaking.',
      placement: 'bottom',
    },
    {
      target: '#tour-step-3',
      content: 'Acompanhe a proporção de cliques de humanos versus tráfego suspeito. Você pode filtrar por período.',
      placement: 'top',
    },
    {
      target: '#tour-step-4',
      content: 'Todas as suas rotas criadas aparecerão aqui. Você pode ativar/desativar modos e acessar ações rápidas.',
      placement: 'top',
    },
    {
      target: '#tour-step-5',
      content: 'Na página de criação, você pode usar nossos modelos para configurar rapidamente filtros para plataformas como Facebook e Google.',
      placement: 'bottom',
      target: 'body', // General target if the element isn't on the page
      // This step is more of a tip, we can navigate or just show it here.
      // For simplicity, we just show it. If you navigate to /routes/new, you could change target to '#tour-step-5'
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <Joyride
      run={run}
      steps={tourSteps}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#e0407d',
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Fim',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  );
};
