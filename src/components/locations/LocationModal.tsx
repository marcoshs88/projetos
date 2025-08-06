import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LocationForm } from './LocationForm';
import { Location } from '@/types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location;
  onSave: (data: Omit<Location, 'id'>) => void;
}

export const LocationModal = ({ isOpen, onClose, location, onSave }: LocationModalProps) => {
  const handleSave = (data: Omit<Location, 'id'>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{location ? 'Editar Local' : 'Novo Local'}</DialogTitle>
        </DialogHeader>
        <LocationForm
          location={location}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};