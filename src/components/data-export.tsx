"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Database, FileText, TestTube } from "lucide-react";
import { exportUserData, downloadExportFile, loadApiConfig, loadSavedPrompts, loadTestResults } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations('DataManagement');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = exportUserData();
      downloadExportFile(data);
      toast.success(t('exportSuccess'));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const getDataSummary = () => {
    const apiConfig = loadApiConfig();
    const savedPrompts = loadSavedPrompts();
    const testResults = loadTestResults();

    return {
      hasApiConfig: !!apiConfig,
      promptsCount: savedPrompts.length,
      testResultsCount: testResults.length
    };
  };

  const summary = getDataSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          {t('exportTitle')}
        </CardTitle>
        <CardDescription>
          {t('exportDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm">{t('apiConfiguration')}</span>
            </div>
            <Badge variant={summary.hasApiConfig ? "default" : "secondary"}>
              {summary.hasApiConfig ? t('configured') : t('notConfigured')}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{t('savedPrompts')}</span>
            </div>
            <Badge variant={summary.promptsCount > 0 ? "default" : "secondary"}>
              {summary.promptsCount} {t('items')}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="text-sm">{t('testResults')}</span>
            </div>
            <Badge variant={summary.testResultsCount > 0 ? "default" : "secondary"}>
              {summary.testResultsCount} {t('items')}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleExport}
            disabled={isExporting || (!summary.hasApiConfig && summary.promptsCount === 0 && summary.testResultsCount === 0)}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? t('exporting') : t('exportData')}
          </Button>
          
          {!summary.hasApiConfig && summary.promptsCount === 0 && summary.testResultsCount === 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t('noDataToExport')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}