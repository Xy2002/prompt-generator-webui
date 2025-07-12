"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { loadSavedPrompts, deleteSavedPrompt, extractVariablesFromTemplate, type SavedPrompt } from "@/lib/storage";
import { Trash2, TestTube, Calendar, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const t = useTranslations('HistoryPage');

  useEffect(() => {
    setSavedPrompts(loadSavedPrompts());
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedPrompt(id);
    setSavedPrompts(loadSavedPrompts());
    toast.success(t('templateDeleted'));
  };

  const handleCopyTemplate = async (template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      toast.success(t('templateCopied'));
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error(t('copyFailed'));
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-CN');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {savedPrompts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{t('noTemplates')}</p>
            <Link href="/">
              <Button>{t('startGenerating')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedPrompts.map((prompt) => (
            <Card key={prompt.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {prompt.task}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(prompt.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyTemplate(prompt.template)}
                      className="cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                      {t('copy')}
                    </Button>
                    <Link href={`/test?id=${prompt.id}`}>
                      <Button size="sm" variant="outline" className="cursor-pointer">
                        <TestTube className="h-4 w-4 mr-1" />
                        {t('test')}
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteConfirmation')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(prompt.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const variables = extractVariablesFromTemplate(prompt.template);
                    return variables.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">{t('variables')}:</p>
                        <div className="flex flex-wrap gap-1">
                          {variables.map((variable, index) => (
                            <Badge key={index} variant="secondary">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <div>
                    <p className="text-sm font-medium mb-2">{t('promptTemplate')}:</p>
                    <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto relative group custom-scrollbar">
                      <pre className="whitespace-pre-wrap text-xs">
                        {prompt.template}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}