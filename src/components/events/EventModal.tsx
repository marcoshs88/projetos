import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { Event } from '@/types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSave: (data: Omit<Event, 'id' | 'created_at'>) => void;
}

export const EventModal = ({ isOpen, onClose, event, onSave }: EventModalProps) => {
  const handleSave = (data: Omit<Event, 'id' | 'created_at'>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          event={event}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};