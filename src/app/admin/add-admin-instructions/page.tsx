
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import withAuth from "@/components/with-auth";
import { ExternalLink, UserPlus } from "lucide-react";
import Image from 'next/image';

const Step = ({ num, title, description, children }: { num: number, title: string, description: string, children?: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0 mt-1">{num}</div>
        <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            {children && <div className="mt-4">{children}</div>}
        </div>
    </div>
);

function AddAdminInstructionsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <UserPlus className="h-8 w-8 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Como Adicionar um Novo Administrador</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Guia Passo a Passo</CardTitle>
          <CardDescription>
            Siga estas instruções no Console do Firebase para conceder privilégios de administrador a um usuário existente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Step num={1} title="Peça para o usuário se cadastrar" description="O usuário que você deseja tornar administrador deve primeiro criar uma conta normalmente através da página de cadastro do seu aplicativo." />

            <Separator />
            
            <Step num={2} title="Encontre o UID do usuário" description="O UID é o Identificador de Usuário único. Você vai precisar dele para a próxima etapa.">
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                     <p>1. Abra o Console do Firebase do seu projeto.</p>
                     <p>2. No menu à esquerda, vá para <strong>Build &gt; Authentication</strong>.</p>
                     <p>3. Na aba <strong>Users</strong>, encontre o usuário pelo e-mail e copie o valor da coluna <strong>User UID</strong>.</p>
                     <Image src="https://placehold.co/800x200.png" alt="Tela de Autenticação do Firebase mostrando a lista de usuários e a coluna UID." width={800} height={200} className="rounded-md mt-2 border" data-ai-hint="firebase authentication" />
                </div>
            </Step>

             <Separator />

            <Step num={3} title="Adicione o documento na coleção 'admins'" description="Esta é a etapa final que concede a permissão de administrador.">
                 <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                     <p>1. No menu à esquerda, vá para <strong>Build &gt; Firestore Database</strong>.</p>
                     <p>2. Certifique-se de que a coleção <strong>admins</strong> está visível. Se não estiver, você pode criá-la.</p>
                     <p>3. Clique em <strong>+ Adicionar documento</strong>.</p>
                     <p>4. Na caixa de diálogo que aparece, cole o <strong>UID</strong> do usuário (que você copiou na etapa 2) no campo <strong>ID do documento</strong>.</p>
                     <p>5. Crie um campo: digite <strong>`role`</strong> no campo 'Campo' e <strong>`admin`</strong> no campo 'Valor'.</p>
                     <p>6. Clique em <strong>Salvar</strong>.</p>
                     <Image src="https://placehold.co/800x400.png" alt="Tela do Firestore mostrando a criação de um novo documento na coleção 'admins' com o UID do usuário e o campo role:admin." width={800} height={400} className="rounded-md mt-2 border" data-ai-hint="firestore database" />
                 </div>
            </Step>
            
            <Separator />

            <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Pronto!</h3>
                <p className="text-muted-foreground">O usuário agora tem acesso de administrador. Peça para ele atualizar a página do aplicativo ou fazer login novamente para que as novas permissões sejam aplicadas.</p>
            </div>
            
        </CardContent>
        <CardFooter>
            <Button asChild>
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir Console do Firebase
                </a>
            </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AddAdminInstructionsPage);
