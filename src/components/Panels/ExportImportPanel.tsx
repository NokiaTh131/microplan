 
import React, { useState } from 'react';
import { Download, Upload, Copy, FileText, Check, AlertCircle } from 'lucide-react';
import { useArchitectureStore } from '../../stores/architectureStore';
import { useArchitectureExport, useArchitectureImport } from '../../hooks/useArchitectureExport';

const ExportImportPanel: React.FC = () => {
  const { nodes } = useArchitectureStore();
  const { downloadArchitecture, copyToClipboard } = useArchitectureExport();
  const { importFromFile, importFromText } = useArchitectureImport();
  
  const [exportName, setExportName] = useState('my-architecture');
  const [exportDescription, setExportDescription] = useState('');
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownload = () => {
    if (nodes.length === 0) {
      setMessage({ type: 'error', text: 'No architecture to export. Add some services first.' });
      return;
    }

    try {
      downloadArchitecture(exportName, exportDescription);
      setMessage({ type: 'success', text: 'Architecture exported successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to export architecture.' });
    }
  };

  const handleCopy = async () => {
    if (nodes.length === 0) {
      setMessage({ type: 'error', text: 'No architecture to copy. Add some services first.' });
      return;
    }

    try {
      const success = await copyToClipboard(exportName, exportDescription);
      if (success) {
        setCopied(true);
        setMessage({ type: 'success', text: 'Architecture copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to copy to clipboard.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to copy architecture.' });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importFromFile(file)
      .then(metadata => {
        setMessage({ type: 'success', text: `Architecture "${metadata.name}" imported successfully!` });
      })
      .catch(error => {
        setMessage({ type: 'error', text: `Import failed: ${error.message}` });
      });
  };

  const handleTextImport = () => {
    if (!importText.trim()) {
      setMessage({ type: 'error', text: 'Please paste architecture JSON first.' });
      return;
    }

    try {
      const metadata = importFromText(importText);
      setMessage({ type: 'success', text: `Architecture "${metadata.name}" imported successfully!` });
      setImportText('');
    } catch (error: any) {
      setMessage({ type: 'error', text: `Import failed: ${error.message}` });
    }
  };

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Export & Import
        </h3>
        <p className="text-sm text-slate-600">
          Save your architecture or load existing designs
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-slate-700 border-b border-slate-200 pb-2">
          Export Architecture
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Architecture Name
            </label>
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="my-microservices-architecture"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={exportDescription}
              onChange={(e) => setExportDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="E-commerce platform with user authentication, payment processing, and inventory management..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-slate-500 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-slate-700 border-b border-slate-200 pb-2">
          Import Architecture
        </h4>

        {/* File Import */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Import from File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> your architecture file
                  </p>
                  <p className="text-xs text-slate-500">JSON files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileImport}
                />
              </label>
            </div>
          </div>

          {/* Text Import */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Import from Text
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
              rows={6}
              placeholder="Paste your architecture JSON here..."
            />
            <button
              onClick={handleTextImport}
              className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Import from Text
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-800 mb-2">Current Architecture</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <div>Services: {nodes.length}</div>
          <div>Status: {nodes.length > 0 ? 'Ready to export' : 'Empty - add services first'}</div>
        </div>
      </div>

      {/* Format Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">Export Format</h5>
        <div className="text-xs text-slate-600 space-y-1">
          <div>• JSON format with metadata and configuration</div>
          <div>• Includes all service definitions and connections</div>
          <div>• Compatible with version control systems</div>
          <div>• Can be shared with team members</div>
        </div>
      </div>
    </div>
  );
};

export default ExportImportPanel;