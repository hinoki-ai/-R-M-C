'use client';

import React, { useState } from 'react';
import { Newspaper, ExternalLink, Clock, User, Archive, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RssArticle {
  _id: string;
  feedId: string;
  title: string;
  description?: string;
  url: string;
  author?: string;
  publishedAt: number;
  imageUrl?: string;
  category: string;
  region: string;
  isRead: boolean;
  tags: string[];
  feedName: string;
  createdAt: number;
}

const RssNewsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Convex queries and mutations
  const articles = useQuery(api.rss.getRssArticles, {
    category: selectedCategory !== 'all' ? selectedCategory as any : undefined,
    limit: 20,
  }) || [];

  const markAsRead = useMutation(api.rss.markArticleAsRead);
  const archiveArticle = useMutation(api.rss.archiveArticle);

  const categories = [
    { id: 'all', label: 'Todas', icon: Newspaper },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'local', label: 'Local', icon: Newspaper },
    { id: 'politics', label: 'Política', icon: Newspaper },
    { id: 'sports', label: 'Deportes', icon: Newspaper },
    { id: 'emergency', label: 'Emergencia', icon: Newspaper },
  ];

  const handleMarkAsRead = async (articleId: string, isRead: boolean) => {
    try {
      await markAsRead({ articleId: articleId as any, isRead });
      toast.success(isRead ? 'Marcado como leído' : 'Marcado como no leído');
    } catch (error) {
      toast.error('Error al actualizar artículo');
    }
  };

  const handleArchive = async (articleId: string, isArchived: boolean) => {
    try {
      await archiveArticle({ articleId: articleId as any, isArchived });
      toast.success(isArchived ? 'Archivado' : 'Desarchivado');
    } catch (error) {
      toast.error('Error al archivar artículo');
    }
  };

  const openArticle = (url: string, articleId: string) => {
    // Mark as read when opening
    handleMarkAsRead(articleId, true);
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-500',
      local: 'bg-green-500',
      politics: 'bg-purple-500',
      sports: 'bg-orange-500',
      emergency: 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'Nacional': 'bg-blue-600',
      'Ñuble': 'bg-green-600',
      'Biobío': 'bg-orange-600',
      'Pinto': 'bg-red-600',
      'Recinto': 'bg-purple-600',
    };
    return colors[region] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Noticias RSS</h2>
          <p className="text-muted-foreground">
            Mantente informado con las últimas noticias de fuentes confiables
          </p>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              <category.icon className="h-4 w-4 mr-1" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card
                  key={article._id}
                  className={`transition-all hover:shadow-md ${
                    article.isRead ? 'opacity-75' : 'border-l-4 border-l-primary'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(article.category)} text-white`}>
                            {article.category}
                          </Badge>
                          <Badge variant="secondary" className={`text-xs ${getRegionColor(article.region)} text-white`}>
                            {article.region}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.feedName}
                          </span>
                        </div>

                        <h3 className={`font-semibold mb-2 line-clamp-2 ${
                          article.isRead ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {article.title}
                        </h3>

                        {article.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {article.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {article.author && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(article.publishedAt), {
                                addSuffix: true,
                                locale: es
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {article.imageUrl && (
                        <div className="ml-4 flex-shrink-0">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(article._id, !article.isRead)}
                          className="h-8"
                        >
                          {article.isRead ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Marcar no leído
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Marcar leído
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchive(article._id, true)}
                          className="h-8"
                        >
                          <Archive className="h-3 w-3 mr-1" />
                          Archivar
                        </Button>
                      </div>

                      <Button
                        onClick={() => openArticle(article.url, article._id)}
                        className="h-8"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Leer más
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No hay artículos disponibles</h3>
                <p className="text-muted-foreground">
                  Los artículos se actualizarán automáticamente desde las fuentes RSS.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RssNewsSection;