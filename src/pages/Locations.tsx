import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, MapPin, Users, Phone } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Local } from '@/types';
import { showSuccess } from '@/utils/toast';

const Locations = () => {
  const [locations, setLocations] = useLocalStorage<Local[]>('locations', []);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredLocations = locations.filter(location =>
    location.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.contato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteLocation = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este local?')) {
      setLocations(locations.filter(location => location.id !== id));
      showSuccess('Local excluído com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locais</h1>
          <p className="text-gray-600">Gerencie os locais para eventos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Local
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar locais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum local encontrado' : 'Nenhum local cadastrado'}
                </p>
                {!searchTerm && (
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Local
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLocations.map((location) => (
                  <Card key={location.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{location.nome}</CardTitle>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => deleteLocation(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{location.endereco}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Capacidade: {location.capacidade} pessoas</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{location.contato}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-gray-900">Valor da Locação:</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(location.valor_locacao)}
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

export default Locations;