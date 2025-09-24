'use client';

import { motion } from 'framer-motion';
import { Calendar, Download, Eye, File, FileText, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Document } from '@/types/dashboard';

interface DocumentCardProps {
  document: Document;
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
  compact?: boolean;
}

const typeConfig = {
  statutes: { emoji: '📜', color: 'text-purple-600', label: 'Estatutos' },
  minutes: { emoji: '📝', color: 'text-blue-600', label: 'Actas' },
  regulation: { emoji: '⚖️', color: 'text-red-600', label: 'Reglamentos' },
  financial: { emoji: '💰', color: 'text-green-600', label: 'Financieros' },
  plan: { emoji: '📋', color: 'text-orange-600', label: 'Planes' },
};

export function DocumentCard({
  document,
  onDownload,
  onView,
  compact = false,
}: DocumentCardProps) {
  const type = typeConfig[document.type];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-3 flex-1">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {document.title}
              </h4>
              <span className={type.color}>{type.emoji}</span>
              <Badge variant="outline" className="text-xs">
                {type.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {document.description}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{document.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(document.uploadDate).toLocaleDateString('es-CL')}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <File className="w-3 h-3" />
                  <span>{document.fileSize}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(document.id)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
          )}
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document.id)}
            >
              <Download className="w-4 h-4 mr-1" />
              Descargar
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{document.title}</span>
                  <span className={type.color}>{type.emoji}</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  {document.description}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              {type.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{document.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(document.uploadDate).toLocaleDateString('es-CL')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <File className="w-4 h-4" />
                <span>{document.fileSize}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onView && (
                <Button variant="outline" onClick={() => onView(document.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Online
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="outline"
                  onClick={() => onDownload(document.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Document List Component
interface DocumentListProps {
  documents: Document[];
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
  loading?: boolean;
  compact?: boolean;
  filterByType?: Document['type'];
}

export function DocumentList({
  documents,
  onDownload,
  onView,
  loading,
  compact = false,
  filterByType,
}: DocumentListProps) {
  const filteredDocuments = filterByType
    ? documents.filter(doc => doc.type === filterByType)
    : documents;

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay documentos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {filterByType
            ? `No se encontraron documentos de tipo ${typeConfig[filterByType].label.toLowerCase()}.`
            : 'Los documentos aparecerán aquí cuando estén disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDocuments.map((document, index) => (
        <motion.div
          key={document.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DocumentCard
            document={document}
            onDownload={onDownload}
            onView={onView}
            compact={compact}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Document Filter Component
interface DocumentFilterProps {
  selectedType?: Document['type'];
  onTypeChange: (type?: Document['type']) => void;
  documentCounts: Record<Document['type'], number>;
}

export function DocumentFilter({
  selectedType,
  onTypeChange,
  documentCounts,
}: DocumentFilterProps) {
  const types: Document['type'][] = [
    'statutes',
    'minutes',
    'regulation',
    'financial',
    'plan',
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedType === undefined ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTypeChange(undefined)}
      >
        Todos ({Object.values(documentCounts).reduce((a, b) => a + b, 0)})
      </Button>
      {types.map(type => {
        const config = typeConfig[type];
        return (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(type)}
          >
            <span className="mr-1">{config.emoji}</span>
            {config.label} ({documentCounts[type] || 0})
          </Button>
        );
      })}
    </div>
  );
}
