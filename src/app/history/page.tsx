"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Trash2, TestTube, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    setSavedPrompts(loadSavedPrompts());
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedPrompt(id);
    setSavedPrompts(loadSavedPrompts());
    toast.success("提示模板已删除");
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('zh-CN');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">历史记录</h1>
        <p className="text-muted-foreground">
          查看您生成的所有提示模板，点击测试按钮可以跳转到测试页面
        </p>
      </div>

      {savedPrompts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">还没有保存的提示模板</p>
            <Link href="/">
              <Button>开始生成提示模板</Button>
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
                    <CardTitle className="text-lg line-clamp-2">
                      {prompt.task}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(prompt.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/test?id=${prompt.id}`}>
                      <Button size="sm" variant="outline">
                        <TestTube className="h-4 w-4 mr-1" />
                        测试
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
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除这个提示模板吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(prompt.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            删除
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
                        <p className="text-sm font-medium mb-2">变量:</p>
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
                    <p className="text-sm font-medium mb-2">提示模板:</p>
                    <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs">
                        {prompt.template.length > 500 
                          ? prompt.template.substring(0, 500) + "..."
                          : prompt.template
                        }
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