import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, AlertCircle, Download, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MultiLogViewer = ({ appName }) => {
  const [logs, setLogs] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs?app=${appName}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch logs');
      }

      setLogs(data.logs);
      if (Object.keys(data.logs).length > 0 && !selectedFile) {
        setSelectedFile(Object.keys(data.logs)[0]);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message || 'Failed to fetch logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [appName]);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/download-log?app=${appName}&fileName=${selectedFile}`);
      if (!response.ok) {
        throw new Error('Failed to download log');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = selectedFile;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading log:', err);
      setError(err.message || 'Failed to download log. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/download-log?app=${appName}&fileName=${selectedFile}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete log');
      }
      await fetchLogs();
    } catch (err) {
      console.error('Error deleting log:', err);
      setError(err.message || 'Failed to delete log. Please try again.');
    } finally {
      setDeleting(false);
    }
  };
 
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Logs for {appName}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : Object.keys(logs).length > 0 ? (
          <div>
          <div className="flex w-fit items-center justify-between mb-4">
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger className="w-full mr-2">
                <SelectValue placeholder="Select a log file" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(logs).map((filename) => (
                  <SelectItem key={filename} value={filename}>
                    {filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!selectedFile || downloading}
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-2">Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={!selectedFile || deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-2">Delete</span>
            </Button>
          </div>
          {selectedFile && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 overflow-x-auto max-w-full">
              <pre className="text-sm whitespace-pre overflow-x-scroll max-w-full">
                {logs[selectedFile] || 'No logs available.'}
              </pre>
            </div>
          )}
        </div>
        ) : (
          <p>No log files found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiLogViewer;