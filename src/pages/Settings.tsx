import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event, Monitor, Location } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { Download, Upload, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [monitors, setMonitors] = useLocalStorage<Monitor[]>('monitors', []);
  const [locations, setLocations] = useLocalStorage<Location[]>('locations', []);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      const backupData = {
        events,
        monitors,
        locations,
        exportedAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `backup-gestao-eventos-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Backup exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      showError('Ocorreu um erro ao exportar o backup.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Tem certeza que deseja importar este backup? Todos os dados atuais serão substituídos. Esta ação não pode ser desfeita.')) {
      event.target.value = ''; // Reseta o input
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Falha ao ler o arquivo.');
        }
        const data = JSON.parse(text);

        // Validação básica do arquivo de backup
        if (data && Array.isArray(data.events) && Array.isArray(data.monitors) && Array.isArray(data.locations)) {
          setEvents(data.events);
          setMonitors(data.monitors);
          setLocations(data.locations);
          showSuccess('Backup importado com sucesso!');
        } else {
          throw new Error('Arquivo de backup inválido ou corrompido.');
        }
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        showError('Ocorreu um erro ao importar o backup. Verifique se o arquivo é válido.');
      } finally {
        setIsImporting(false);
        event.target.value = ''; // Reseta o input para permitir o mesmo arquivo novamente
      }
    };
    reader.onerror = () => {
      showError('Não foi possível ler o arquivo.');
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">
          Gerencie os dados da sua aplicação.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração</CardTitle>
          <CardDescription>
            Exporte seus dados para um arquivo seguro ou importe um backup para restaurar suas informações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Exportar Dados</h3>
            <p className="text-sm text-muted-foreground">
              Clique no botão abaixo para fazer o download de todos os seus dados (eventos, monitores, etc.) em um único arquivo JSON.
            </p>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Backup
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Importar Dados</h3>
            <p className="text-sm text-muted-foreground">
              Selecione um arquivo de backup JSON para restaurar os dados na aplicação.
            </p>
            <div className="flex items-center space-x-2">
              <label htmlFor="import-file" className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 cursor-pointer ${isImporting ? 'opacity-50' : ''}`}>
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'Importando...' : 'Selecionar Arquivo'}
                <Input
                  id="import-file"
                  type="file"
                  className="sr-only"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
              </label>
            </div>
            <div className="mt-4 flex items-start space-x-3 rounded-md border border-yellow-300 bg-yellow-50 p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Atenção</p>
                <p>A importação de um backup substituirá permanentemente todos os dados existentes na aplicação. Esta ação não pode ser desfeita.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;