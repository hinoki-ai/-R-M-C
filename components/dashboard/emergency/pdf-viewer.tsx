'use client';

import React, { useState } from 'react';
import { X, Download, Eye, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface EmergencyProtocol {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    role: string;
  }>;
  steps: string[];
}

interface PDFViewerProps {
  protocol: EmergencyProtocol | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (protocolId: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ protocol, isOpen, onClose, onDownload }) => {
  const [loadError, setLoadError] = useState(false);

  if (!protocol) return null;

  const handleDownload = () => {
    onDownload(protocol._id);
    // Create a temporary link to download the PDF
    const link = document.createElement('a');
    link.href = protocol.pdfUrl;
    link.download = `${protocol.title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fire: 'bg-red-500',
      medical: 'bg-blue-500',
      police: 'bg-green-500',
      natural_disaster: 'bg-orange-500',
      security: 'bg-purple-500',
      evacuation: 'bg-yellow-500',
      general: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, 'destructive' | 'default' | 'secondary'> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return colors[priority] || 'secondary';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{protocol.title}</DialogTitle>
              <p className="text-muted-foreground mt-1">{protocol.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPriorityColor(protocol.priority)} className="text-xs">
                  {protocol.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getCategoryColor(protocol.category)} text-white`}>
                  {protocol.category.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            {loadError ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error al cargar el PDF</h3>
                <p className="text-muted-foreground text-center mb-4">
                  No se pudo cargar el documento. Puede descargarlo para verlo offline.
                </p>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            ) : (
              <iframe
                src={protocol.pdfUrl}
                className="w-full h-full min-h-[600px] border-0"
                title={protocol.title}
                onError={() => setLoadError(true)}
              />
            )}
          </div>

          {/* Protocol Details Sidebar */}
          <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Contactos de Emergencia
              </h3>
              <div className="space-y-2">
                {protocol.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-3">Procedimiento</h3>
              <ol className="space-y-2">
                {protocol.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-4 border">
              <div className="space-y-2">
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button onClick={onClose} className="w-full" variant="secondary">
                  <Eye className="h-4 w-4 mr-2" />
                  Cerrar Vista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;