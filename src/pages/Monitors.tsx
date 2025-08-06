import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Monitor } from '@/types';
import { showSuccess } from '@/utils/toast';

const Monitors = () => {
  const [monitors, setMonitors] = useLocalStorage<Monitor[]>('monitors', []);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredMonitors = monitors.filter(monitor =>
    monitor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monitor.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monitor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteMonitor = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este monitor?')) {
      setMonitors(monitors.filter(monitor => monitor.id !== id));
      showSuccess('Monitor excluído com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitores</h1>
          <p className="text-gray-600">Gerencie sua equipe de monitores</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Monitor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar monitores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMonitors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum monitor encontrado' : 'Nenhum monitor cadastrado'}
                </p>
                {!searchTerm && (
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Monitor
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMonitors.map((monitor) => (
                  <Card key={monitor.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{monitor.nome}</CardTitle>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => deleteMonitor(monitor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{monitor.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{monitor.email}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-900">Especialidade:</p>
                        <p className="text-sm text-gray-600">{monitor.especialidade}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-gray-900">Valor/Hora:</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(monitor.valor_hora)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitors;