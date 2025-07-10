
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarClock, PlusCircle, Trash2, Edit, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from 'uuid';

type TimeRule = {
  id: string;
  routeName: string;
  days: string[];
  startTime: string;
  endTime: string;
  action: 'force_fake' | 'force_real';
  priority: boolean;
};

const initialRules: TimeRule[] = [
    { id: '1', routeName: 'promo-abc', days: ['seg', 'ter', 'qua', 'qui', 'sex'], startTime: '00:00', endTime: '06:00', action: 'force_fake', priority: true },
    { id: '2', routeName: 'campaign-xyz', days: ['sab', 'dom'], startTime: '10:00', endTime: '18:00', action: 'force_real', priority: false },
];

const mockRoutes = [
    { id: '1', slug: 'promo-abc' },
    { id: '2', slug: 'campaign-xyz' },
    { id: '3', slug: 'lander-v2' },
];

const dayMappings = [
    { value: 'seg', label: 'S' },
    { value: 'ter', label: 'T' },
    { value: 'qua', label: 'Q' },
    { value: 'qui', label: 'Q' },
    { value: 'sex', label: 'S' },
    { value: 'sab', label: 'S' },
    { value: 'dom', label: 'D' },
];

const emptyRule = {
    routeName: '',
    days: [] as string[],
    startTime: '',
    endTime: '',
    action: 'force_fake' as 'force_fake' | 'force_real',
    priority: false,
};

export default function SchedulingPage() {
    const [rules, setRules] = useState<TimeRule[]>(initialRules);
    const [isAdding, setIsAdding] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<TimeRule | null>(null);
    const [ruleToEdit, setRuleToEdit] = useState<TimeRule | null>(null);

    // State for the form fields
    const [currentRule, setCurrentRule] = useState<Omit<TimeRule, 'id'>>(emptyRule);

    useEffect(() => {
        if (ruleToEdit) {
            setCurrentRule(ruleToEdit);
        } else {
            setCurrentRule(emptyRule);
        }
    }, [ruleToEdit]);

    const handleFormValueChange = (field: keyof typeof currentRule, value: any) => {
        setCurrentRule(prev => ({...prev, [field]: value}));
    };
    
    const openAddForm = () => {
        setRuleToEdit(null);
        setCurrentRule(emptyRule);
        setIsAdding(true);
    }
    
    const openEditForm = (rule: TimeRule) => {
        setIsAdding(false);
        setRuleToEdit(rule);
        setCurrentRule(rule);
    }

    const closeForm = () => {
        setIsAdding(false);
        setRuleToEdit(null);
        setCurrentRule(emptyRule);
    }

    const handleSaveRule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (ruleToEdit) {
            // Update existing rule
            setRules(prev => prev.map(r => r.id === ruleToEdit.id ? { ...currentRule, id: r.id } : r));
            toast({
                title: "Regra Atualizada!",
                description: "Sua regra de agendamento foi atualizada com sucesso.",
            });
        } else {
            // Add new rule
            const ruleToAdd = { ...currentRule, id: uuidv4() };
            setRules(prev => [...prev, ruleToAdd]);
            toast({
                title: "Regra Salva!",
                description: "Sua nova regra de agendamento foi salva com sucesso.",
            });
        }
        
        closeForm();
    };
    
    const handleDeleteRule = () => {
        if (ruleToDelete) {
            setRules(rules.filter(rule => rule.id !== ruleToDelete.id));
            toast({
                title: "Regra Excluída",
                description: `A regra para a rota /${ruleToDelete.routeName} foi removida.`,
            });
            setRuleToDelete(null);
        }
    };
    
    const isFormOpen = isAdding || !!ruleToEdit;

    return (
        <DashboardLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2"><CalendarClock className="h-8 w-8 text-primary"/> Agendamento & Gatilhos</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Regras Ativas</CardTitle>
                            <CardDescription>Gerencie as regras de automação baseadas em horário para suas rotas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rules.length === 0 && !isFormOpen && (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>Nenhuma regra de horário criada ainda.</p>
                                </div>
                            )}
                            {rules.map(rule => (
                                <div key={rule.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">Regra para <span className="font-code text-primary">/{rule.routeName}</span></p>
                                        <p className="text-sm text-muted-foreground">
                                            {rule.days.join(', ')} das {rule.startTime} às {rule.endTime}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {rule.action === 'force_fake' ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-green-500" />}
                                            <span className="text-sm font-medium">{rule.action === 'force_fake' ? 'Forçar URL Falsa' : 'Forçar URL Real'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-start md:self-center">
                                        <Button variant="ghost" size="icon" onClick={() => openEditForm(rule)}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setRuleToDelete(rule)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ))}
                             {!isFormOpen && (
                                <Button onClick={openAddForm} variant="outline" className="w-full mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Nova Regra de Horário
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                     {isFormOpen ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>{ruleToEdit ? 'Editar Regra' : 'Nova Regra de Horário'}</CardTitle>
                                <CardDescription>Defina quando e como a regra será aplicada.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSaveRule}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="route">Rota</Label>
                                        <Select required onValueChange={(value) => handleFormValueChange('routeName', value)} value={currentRule.routeName}>
                                            <SelectTrigger id="route">
                                                <SelectValue placeholder="Selecione a rota" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockRoutes.map(r => <SelectItem key={r.id} value={r.slug}>/{r.slug}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dias da Semana</Label>
                                        <ToggleGroup type="multiple" variant="outline" className="justify-start flex-wrap" onValueChange={(value) => handleFormValueChange('days', value)} value={currentRule.days}>
                                            {dayMappings.map(day => <ToggleGroupItem key={day.value} value={day.value}>{day.label}</ToggleGroupItem>)}
                                        </ToggleGroup>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start-time">Início</Label>
                                            <Input id="start-time" type="time" required value={currentRule.startTime} onChange={(e) => handleFormValueChange('startTime', e.target.value)}/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end-time">Fim</Label>
                                            <Input id="end-time" type="time" required value={currentRule.endTime} onChange={(e) => handleFormValueChange('endTime', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="action">Ação</Label>
                                        <Select required onValueChange={(value: 'force_fake' | 'force_real') => handleFormValueChange('action', value)} value={currentRule.action}>
                                            <SelectTrigger id="action">
                                                <SelectValue placeholder="Selecione a ação" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="force_fake">Forçar URL Falsa</SelectItem>
                                                <SelectItem value="force_real">Forçar URL Real</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label>Prioridade Alta</Label>
                                            <p className="text-xs text-muted-foreground">Sobrepõe outras regras de filtragem.</p>
                                        </div>
                                        <Switch checked={currentRule.priority} onCheckedChange={(checked) => handleFormValueChange('priority', checked)}/>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={closeForm} type="button">Cancelar</Button>
                                    <Button type="submit">Salvar Regra</Button>
                                </CardFooter>
                            </form>
                        </Card>
                     ) : (
                        <Card className="bg-muted/50 border-dashed">
                            <CardHeader>
                                <CardTitle>Gatilhos Inteligentes</CardTitle>
                                <CardDescription>Automações baseadas em eventos, como detecção de URL offline ou picos de tráfego suspeito.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-32">
                                <p className="text-sm text-muted-foreground">Em breve...</p>
                            </CardContent>
                        </Card>
                     )}
                </div>
            </div>
            
            <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a regra para a rota 
                    <span className="font-bold font-code text-foreground"> /{ruleToDelete?.routeName}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRule} className="bg-destructive hover:bg-destructive/90">
                    Sim, excluir regra
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
