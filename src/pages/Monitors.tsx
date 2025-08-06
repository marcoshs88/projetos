import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Monitor } from '@/types';
import { showSuccess } from '@/utils/toast';
import { Plus, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { MonitorModal } from '@/components/monitors/MonitorModal';

const Monitors = () => {
  const [monitors, setMonitors] = useLocalStorage<Monitor[]>('monitors', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | undefined>();

  const handleCreateMonitor = () => {
    setEditingMonitor(undefined);
    setIsModalOpen(true);
  };

  const handleEditMonitor = (monitor: Monitor) => {
    setEditingMonitor(monitor);
    setIsModalOpen(true);
  };

  const handleDeleteMonitor = (monitorId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este monitor?')) {
      setMonitors(prev => prev.filter(m => m.id !== monitorId));
      showSuccess('Monitor excluído com sucesso!');
    }
  };

  const handleSaveMonitor = (monitorData: Omit<Monitor, 'id'>) => {
    if (editingMonitor) {
      setMonitors(prev => prev.map(m => 
        m.id === editingMonitor.id ? { ...monitorData, id: m.id } : m
      ));
      showSuccess('Monitor atualizado com sucesso!');
    } else {
      const newMonitor: Monitor = { ...monitorData, id: crypto.randomUUID() };
      setMonitors(prev => [...prev, newMonitor]);
      showSuccess('Monitor criado com sucesso!');
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitores</h1>
          <p className="text-gray-600">Gerencie sua equipe de monitores</p>
        </div>
        <Button onClick={handleCreateMonitor}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Monitor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum monitor cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece cadastrando sua equipe</p>
            <Button onClick={handleCreateMonitor}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Monitor
            </Button>
          </div>
        ) : (
          monitors.map((monitor) => (
            <Card key={monitor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{monitor.nome}</CardTitle>
                    <Badge className={getStatusBadge(monitor.status)}>{monitor.status}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditMonitor(monitor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteMonitor(monitor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {monitor.telefone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {monitor.email}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monitor={editingMonitor}
        onSave={handleSaveMonitor}
      />
    </div>
  );
};

export default Monitors;