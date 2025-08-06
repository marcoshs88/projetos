import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MonitorForm } from './MonitorForm';
import { Monitor } from '@/types';

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  monitor?: Monitor;
  onSave: (data: Omit<Monitor, 'id'>) => void;
}

export const MonitorModal = ({ isOpen, onClose, monitor, onSave }: MonitorModalProps) => {
  const handleSave = (data: Omit<Monitor, 'id'>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{monitor ? 'Editar Monitor' : 'Novo Monitor'}</DialogTitle>
        </DialogHeader>
        <MonitorForm
          monitor={monitor}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};