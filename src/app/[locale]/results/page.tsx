"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  loadTestResults,
  deleteTestResult,
  type TestResult
} from "@/lib/storage";
import {
  Search,
  Trash2,
  Calendar,
  TestTube,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function TestResultsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const t = useTranslations('TestResults');

  useEffect(() => {
    loadTestResultsData();
  }, []);

  const loadTestResultsData = () => {
    const results = loadTestResults();
    setTestResults(results);
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteTestResult(id);
      loadTestResultsData();
      toast.success(t('deleteSuccess'));
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copiedToClipboard'));
  };

  const filteredResults = testResults.filter(result =>
    result.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.variables.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Search and Stats */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {t('totalResults')}: {testResults.length}
              </Badge>
              {searchTerm && (
                <Badge variant="secondary">
                  {t('filtered')}: {filteredResults.length}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  {testResults.length === 0 ? t('noResults') : t('noFilteredResults')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('testPromptsToSeeResults')}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResults.map((result) => (
              <Card key={result.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardTitle className="text-lg line-clamp-1 cursor-help">
                            {result.task}
                          </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="max-w-md select-text"
                          side="bottom"
                          align="start"
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {result.task}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <CardDescription className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(result.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TestTube className="h-3 w-3" />
                          {result.variables.length} {t('variables')}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(result.id)}
                      >
                        {expandedResults.has(result.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResult(result.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Variables */}
                  {result.variables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t('variableValues')}:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.variables.map((variable) => (
                          <div key={variable} className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {variable}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {result.variableValues[variable] || t('emptyValue')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Template and Result */}
                  {expandedResults.has(result.id) && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{t('promptTemplate')}:</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.template)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs">
                            {result.template}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{t('testResult')}:</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.result)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs">
                            {result.result}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick preview when collapsed */}
                  {!expandedResults.has(result.id) && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.result}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}