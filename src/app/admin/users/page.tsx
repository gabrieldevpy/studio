
"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, MoreHorizontal, ShieldOff, Edit, Eye } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type User = {
    id: string;
    name: string;
    email: string;
    plan: 'Iniciante' | 'Pro' | 'Empresarial';
    createdAt: any; // Firestore timestamp
    status: 'active' | 'banned';
};

function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                status: 'active', // Placeholder
                ...doc.data()
            } as User));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar os usuários." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary" /> Gerenciamento de Usuários</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Todos os Usuários</CardTitle>
                    <CardDescription>
                        Visualize e gerencie todos os usuários cadastrados no sistema.
                    </CardDescription>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por nome ou e-mail..."
                            className="w-full pl-8 sm:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Data de Cadastro</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.plan === 'Pro' ? 'default' : (user.plan === 'Empresarial' ? 'destructive' : 'secondary')}>
                                                {user.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'active' ? 'outline' : 'destructive'} className={user.status === 'active' ? "border-green-500 text-green-500" : ""}>
                                                {user.status === 'active' ? 'Ativo' : 'Banido'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem disabled><Eye className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                                                    <DropdownMenuItem disabled><Edit className="mr-2 h-4 w-4" /> Editar Usuário</DropdownMenuItem>
                                                    <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                                                        <ShieldOff className="mr-2 h-4 w-4" /> Banir Usuário
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}

export default withAuth(AdminUsersPage);
