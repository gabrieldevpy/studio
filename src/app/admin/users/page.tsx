
"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, MoreHorizontal, ShieldOff, Edit, ShieldCheck, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';

import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
    
    // State for modals
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // State for edit form
    const [editName, setEditName] = useState('');
    const [editPlan, setEditPlan] = useState<'Iniciante' | 'Pro' | 'Empresarial'>('Iniciante');

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
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

    const openEditModal = (user: User) => {
        setUserToEdit(user);
        setEditName(user.name);
        setEditPlan(user.plan);
    };

    const handleSaveChanges = async () => {
        if (!userToEdit) return;
        setIsSaving(true);
        try {
            const userRef = doc(db, 'users', userToEdit.id);
            await updateDoc(userRef, {
                name: editName,
                plan: editPlan,
            });
            toast({ title: "Sucesso", description: "Usuário atualizado com sucesso." });
            setUserToEdit(null);
        } catch (error) {
            console.error("Error updating user:", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o usuário." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!userToToggleStatus) return;
        setIsSaving(true);
        const newStatus = userToToggleStatus.status === 'active' ? 'banned' : 'active';
        try {
             const userRef = doc(db, 'users', userToToggleStatus.id);
             await updateDoc(userRef, { status: newStatus });
             toast({ title: "Sucesso", description: `O status do usuário foi alterado para ${newStatus === 'active' ? 'ativo' : 'banido'}.` });
             setUserToToggleStatus(null);
        } catch (error) {
            console.error("Error updating user status:", error);
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível alterar o status do usuário." });
        } finally {
            setIsSaving(false);
        }
    };


    const filteredUsers = users.filter(user =>
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                                    <DropdownMenuItem onSelect={() => openEditModal(user)}><Edit className="mr-2 h-4 w-4" /> Editar Usuário</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => setUserToToggleStatus(user)} className={user.status === 'active' ? "text-destructive focus:text-destructive" : "text-green-500 focus:text-green-500"}>
                                                        {user.status === 'active' ? <ShieldOff className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                                        {user.status === 'active' ? 'Banir Usuário' : 'Reativar Usuário'}
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

            {/* Edit User Dialog */}
            <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Altere as informações do usuário. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" value={userToEdit?.email || ''} disabled className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">Plano</Label>
                            <Select value={editPlan} onValueChange={(value: 'Iniciante' | 'Pro' | 'Empresarial') => setEditPlan(value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione um plano" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                                    <SelectItem value="Pro">Pro</SelectItem>
                                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setUserToEdit(null)}>Cancelar</Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban/Unban Confirmation Dialog */}
             <AlertDialog open={!!userToToggleStatus} onOpenChange={(open) => !open && setUserToToggleStatus(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                       {userToToggleStatus?.status === 'active'
                            ? `Isso impedirá o usuário ${userToToggleStatus?.email} de acessar o sistema.`
                            : `Isso restaurará o acesso para o usuário ${userToToggleStatus?.email}.`
                       }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleToggleStatus} 
                        className={userToToggleStatus?.status === 'active' ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-600/90"}
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {userToToggleStatus?.status === 'active' ? "Sim, banir usuário" : "Sim, reativar usuário"}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AdminLayout>
    );
}

export default withAuth(AdminUsersPage);
