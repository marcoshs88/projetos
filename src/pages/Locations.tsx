import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Location } from '@/types';
import { showSuccess } from '@/utils/toast';
import { Plus, Edit, Trash2, MapPin, Phone, Users } from 'lucide-react';
import { LocationModal } from '@/components/locations/LocationModal';

const Locations = () => {
  const [locations, setLocations] = useLocalStorage<Location[]>('locations', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();

  const handleCreateLocation = () => {
    setEditingLocation(undefined);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      setLocations(prev => prev.filter(l => l.id !== locationId));
      showSuccess('Local excluído com sucesso!');
    }
  };

  const handleSaveLocation = (locationData: Omit<Location, 'id'>) => {
    if (editingLocation) {
      setLocations(prev => prev.map(l => 
        l.id === editingLocation.id ? { ...locationData, id: l.id } : l
      ));
      showSuccess('Local atualizado com sucesso!');
    } else {
      const newLocation: Location = { ...locationData, id: crypto.randomUUID() };
      setLocations(prev => [...prev, newLocation]);
      showSuccess('Local criado com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locais</h1>
          <p className="text-gray-600">Gerencie os locais dos seus eventos</p>
        </div>
        <Button onClick={handleCreateLocation}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Local
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum local cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece cadastrando os locais dos eventos</p>
            <Button onClick={handleCreateLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Local
            </Button>
          </div>
        ) : (
          locations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{location.nome}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditLocation(location)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteLocation(location.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {location.endereco}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {location.contato}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Capacidade: {location.capacidade}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={editingLocation}
        onSave={handleSaveLocation}
      />
    </div>
  );
};

export default Locations;