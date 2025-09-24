'use client';

import {
  IconAlertTriangle,
  IconBug,
  IconCheck,
  IconClock,
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConvexErrorType } from '@/hooks/use-convex-error-handler';
import { useErrorLogger } from '@/lib/error-logger';

interface ErrorReportingDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ErrorReportingDashboard({
  isOpen,
  onClose,
}: ErrorReportingDashboardProps) {
  const { getLogs, getLogsByType, getStats, clearLogs, markResolved } =
    useErrorLogger();

  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedType, setSelectedType] = useState<ConvexErrorType | 'all'>(
    'all'
  );
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, selectedType, showResolved]);

  const refreshData = () => {
    const allLogs =
      selectedType === 'all' ? getLogs() : getLogsByType(selectedType);
    const filteredLogs = showResolved
      ? allLogs
      : allLogs.filter(log => !log.resolved);
    setLogs(filteredLogs);
    setStats(getStats());
  };

  const handleClearLogs = () => {
    if (
      confirm(
        'Are you sure you want to clear all error logs? This action cannot be undone.'
      )
    ) {
      clearLogs();
      refreshData();
    }
  };

  const handleMarkResolved = (id: string) => {
    markResolved(id);
    refreshData();
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'network':
        return '🌐';
      case 'auth':
        return '🔐';
      case 'permission':
        return '🚫';
      case 'data':
        return '📊';
      case 'server':
        return '🖥️';
      case 'timeout':
        return '⏱️';
      default:
        return '❓';
    }
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'network':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      case 'auth':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'permission':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'data':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950';
      case 'server':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950';
      case 'timeout':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBug className="h-5 w-5" />
            Error Reporting Dashboard
          </DialogTitle>
          <DialogDescription>
            Monitor and manage application errors and issues
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Errors
                    </p>
                    <p className="text-2xl font-bold">{stats.total || 0}</p>
                  </div>
                  <IconAlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last 24h
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.last24Hours || 0}
                    </p>
                  </div>
                  <IconClock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Unresolved
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.unresolved || 0}
                    </p>
                  </div>
                  <IconBug className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      This Week
                    </p>
                    <p className="text-2xl font-bold">{stats.last7Days || 0}</p>
                  </div>
                  <IconRefresh className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Errors by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {Object.entries(stats.byType || {}).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getErrorTypeColor(type)}`}
                    >
                      <span>{getErrorTypeIcon(type)}</span>
                      <span className="capitalize">{type}</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {count as number}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="error-type-filter"
                  className="text-sm font-medium"
                >
                  Filter by type:
                </label>
                <select
                  id="error-type-filter"
                  value={selectedType}
                  onChange={e =>
                    setSelectedType(e.target.value as ConvexErrorType | 'all')
                  }
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="network">Network</option>
                  <option value="auth">Authentication</option>
                  <option value="permission">Permission</option>
                  <option value="data">Data</option>
                  <option value="server">Server</option>
                  <option value="timeout">Timeout</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResolved(!showResolved)}
                className="flex items-center gap-2"
              >
                {showResolved ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
                {showResolved ? 'Hide' : 'Show'} Resolved
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearLogs}>
                <IconTrash className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Error Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Error Logs ({logs.length})</CardTitle>
              <CardDescription>
                Recent errors and issues encountered in the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <IconCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No errors found matching your criteria.</p>
                    </div>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getErrorTypeIcon(log.type)}
                            </span>
                            <Badge
                              variant={
                                log.resolved ? 'secondary' : 'destructive'
                              }
                              className="capitalize"
                            >
                              {log.type}
                            </Badge>
                            {log.resolved && (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                <IconCheck className="h-3 w-3 mr-1" />
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!log.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkResolved(log.id)}
                              >
                                <IconCheck className="h-4 w-4 mr-2" />
                                Mark Resolved
                              </Button>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="font-medium mb-2">{log.message}</p>

                        {log.additionalData &&
                          Object.keys(log.additionalData).length > 0 && (
                            <details className="mb-2">
                              <summary className="text-sm font-medium cursor-pointer hover:text-primary">
                                Additional Data
                              </summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(log.additionalData, null, 2)}
                              </pre>
                            </details>
                          )}

                        {log.stack && (
                          <details>
                            <summary className="text-sm font-medium cursor-pointer hover:text-primary">
                              Stack Trace
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
                              {log.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
