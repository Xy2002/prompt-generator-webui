"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, AlertCircle, CheckCircle, Database, TestTube } from "lucide-react";
import { importFromFile, validateImportData, type ExportData, type ImportResult } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function DataImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importOptions, setImportOptions] = useState({
    importApiConfig: true,
    importPrompts: true,
    importTestResults: true,
    mergeData: true
  });
  const [previewData, setPreviewData] = useState<ExportData | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('DataManagement');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error(t('invalidFileType'));
      return;
    }

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      const validation = validateImportData(data);
      
      if (!validation.valid) {
        toast.error(validation.error || t('invalidFileFormat'));
        setPreviewData(null);
        return;
      }

      setPreviewData(data);
      setImportResult(null);
      toast.success(t('fileValidated'));
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error(t('fileParsingError'));
      setPreviewData(null);
    }
  };

  const handleImport = async () => {
    if (!previewData) return;

    try {
      setIsImporting(true);
      const result = await importFromFile(new File([JSON.stringify(previewData)], 'import.json'));
      
      if (result.success) {
        toast.success(t('importSuccess'));
        setImportResult(result);
        setPreviewData(null);
        // 重置文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result.message);
        setImportResult(result);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(t('importFailed'));
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setPreviewData(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('importTitle')}
        </CardTitle>
        <CardDescription>
          {t('importDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 文件选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('selectFile')}</label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="flex-1 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {previewData && (
              <Button variant="outline" size="sm" onClick={resetForm}>
                {t('reset')}
              </Button>
            )}
          </div>
        </div>

        {/* 预览数据 */}
        {previewData && (
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{t('filePreview')}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex justify-between">
                <span>{t('exportVersion')}:</span>
                <Badge variant="outline">{previewData.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span>{t('exportDate')}:</span>
                <span className="text-muted-foreground">
                  {new Date(previewData.exportedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('apiConfiguration')}:</span>
                <Badge variant={previewData.apiConfig ? "default" : "secondary"}>
                  {previewData.apiConfig ? t('included') : t('notIncluded')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>{t('savedPrompts')}:</span>
                <Badge variant={previewData.savedPrompts.length > 0 ? "default" : "secondary"}>
                  {previewData.savedPrompts.length} {t('items')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>{t('testResults')}:</span>
                <Badge variant={previewData.testResults.length > 0 ? "default" : "secondary"}>
                  {previewData.testResults.length} {t('items')}
                </Badge>
              </div>
            </div>

            {/* 导入选项 */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-sm font-medium">{t('importOptions')}</label>
              
              <div className="space-y-2">
                {previewData.apiConfig && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="importApiConfig"
                      checked={importOptions.importApiConfig}
                      onCheckedChange={(checked: boolean) =>
                        setImportOptions(prev => ({ ...prev, importApiConfig: checked }))
                      }
                    />
                    <label htmlFor="importApiConfig" className="text-sm flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {t('importApiConfig')}
                    </label>
                  </div>
                )}

                {previewData.savedPrompts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="importPrompts"
                      checked={importOptions.importPrompts}
                      onCheckedChange={(checked: boolean) =>
                        setImportOptions(prev => ({ ...prev, importPrompts: checked }))
                      }
                    />
                    <label htmlFor="importPrompts" className="text-sm flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {t('importPrompts')} ({previewData.savedPrompts.length})
                    </label>
                  </div>
                )}

                {previewData.testResults.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="importTestResults"
                      checked={importOptions.importTestResults}
                      onCheckedChange={(checked: boolean) =>
                        setImportOptions(prev => ({ ...prev, importTestResults: checked }))
                      }
                    />
                    <label htmlFor="importTestResults" className="text-sm flex items-center gap-1">
                      <TestTube className="h-3 w-3" />
                      {t('importTestResults')} ({previewData.testResults.length})
                    </label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mergeData"
                    checked={importOptions.mergeData}
                    onCheckedChange={(checked: boolean) =>
                      setImportOptions(prev => ({ ...prev, mergeData: checked }))
                    }
                  />
                  <label htmlFor="mergeData" className="text-sm">
                    {t('mergeWithExisting')}
                  </label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleImport}
              disabled={isImporting || (!importOptions.importApiConfig && !importOptions.importPrompts && !importOptions.importTestResults)}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? t('importing') : t('importData')}
            </Button>
          </div>
        )}

        {/* 导入结果 */}
        {importResult && (
          <div className={`space-y-2 p-3 rounded-lg ${importResult.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {importResult.success ? t('importSuccessTitle') : t('importFailedTitle')}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">{importResult.message}</p>
            
            {importResult.success && (
              <div className="text-xs space-y-1">
                {importResult.imported.apiConfig && (
                  <div>✓ {t('apiConfigurationImported')}</div>
                )}
                {importResult.imported.promptsCount > 0 && (
                  <div>✓ {importResult.imported.promptsCount} {t('promptsImported')}</div>
                )}
                {importResult.imported.testResultsCount > 0 && (
                  <div>✓ {importResult.imported.testResultsCount} {t('testResultsImported')}</div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}