import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event, ExtractedData } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();
  const [, setEvents] = useLocalStorage<Event[]>('events', []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Por favor, selecione um arquivo PDF.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simular progresso do upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    // Simular extração de dados
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearInterval(progressInterval);
    setUploadProgress(100);

    // Simular dados extraídos do PDF
    const extractedData: ExtractedData = {
      cliente: selectedFile.name.replace(/\.[^/.]+$/, "").split(' - ')[1] || 'Cliente do Contrato',
      data: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias no futuro
      local: 'Local a Confirmar',
      valor_total: Math.floor(Math.random() * 5000) + 1000,
      valor_pago: 0,
      servico: `Serviços conforme contrato: ${selectedFile.name}`,
      status: 'pendente'
    };

    showSuccess('Dados extraídos com sucesso! Revise e salve o evento.');

    // Redirecionar para a página de eventos com os dados pré-preenchidos
    navigate('/eventos', { state: { prefillData: extractedData } });

    // Resetar estado
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload de Contrato</h1>
        <p className="text-gray-600">
          Envie um contrato em PDF para extrair os dados e criar um evento automaticamente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Arquivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500">Somente PDF (MAX. 10MB)</p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </label>
          </div>

          {selectedFile && !isUploading && (
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button onClick={handleUpload}>
                <UploadCloud className="h-4 w-4 mr-2" />
                Iniciar Extração
              </Button>
            </div>
          )}

          {isUploading && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {uploadProgress < 100 ? 'Extraindo dados...' : 'Extração Concluída!'}
                </p>
                {uploadProgress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;