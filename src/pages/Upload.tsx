import { useState } from 'react';
import { PDFUploader } from '@/components/upload/PDFUploader';
import { ExtractedDataForm } from '@/components/upload/ExtractedDataForm';
import { extractDataFromPDF, ExtractedData, validatePDFFile } from '@/utils/pdfExtractor';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Event } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    if (!validatePDFFile(file)) {
      showError('Arquivo PDF inválido');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await extractDataFromPDF(file);
      setExtractedData(data);
      showSuccess('Dados extraídos com sucesso!');
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      showError('Erro ao processar o arquivo PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'created_at'>) => {
    const newEvent: Event = {
      ...eventData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };

    setEvents(prev => [...prev, newEvent]);
    showSuccess('Evento cadastrado com sucesso!');
    
    // Reset form
    setExtractedData(null);
    
    // Navigate to events page
    navigate('/eventos');
  };

  const handleEditData = () => {
    setExtractedData(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload de Contrato</h1>
        <p className="text-gray-600">
          Faça upload do contrato em PDF para extrair automaticamente as informações do evento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PDFUploader 
            onFileUpload={handleFileUpload} 
            isProcessing={isProcessing}
          />
          
          {isProcessing && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="font-medium text-blue-900">Processando PDF...</h3>
                  <p className="text-sm text-blue-700">
                    Extraindo informações do contrato usando IA
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {extractedData && (
            <ExtractedDataForm
              extractedData={extractedData}
              onSave={handleSaveEvent}
              onEdit={handleEditData}
            />
          )}
        </div>
      </div>

      {!extractedData && !isProcessing && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Como funciona?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <p>Faça upload do contrato em formato PDF</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <p>Nossa IA extrai automaticamente as informações</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <p>Revise e confirme os dados antes de salvar</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;