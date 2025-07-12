export interface SavedPrompt {
  id: string;
  task: string;
  template: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  promptId: string;
  task: string;
  template: string;
  variables: string[];
  variableValues: Record<string, string>;
  result: string;
  createdAt: string;
}

export interface ApiConfig {
  baseURL: string;
  apiKey: string;
  modelName: string;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  apiConfig: ApiConfig | null;
  savedPrompts: SavedPrompt[];
  testResults: TestResult[];
}

export interface ImportResult {
  success: boolean;
  message: string;
  imported: {
    apiConfig: boolean;
    promptsCount: number;
    testResultsCount: number;
  };
}

// API配置本地存储
export const saveApiConfig = (config: ApiConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('prompt-generator-api-config', JSON.stringify(config));
  }
};

export const loadApiConfig = (): ApiConfig | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-api-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
};

// 保存的提示模板本地存储
export const savePrompt = (task: string, template: string): SavedPrompt => {
  const prompt: SavedPrompt = {
    id: Date.now().toString(),
    task,
    template,
    createdAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    const saved = loadSavedPrompts();
    saved.unshift(prompt); // 新的放在前面
    localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(saved));
  }

  return prompt;
};

export const loadSavedPrompts = (): SavedPrompt[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-saved-prompts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const deleteSavedPrompt = (id: string) => {
  if (typeof window !== 'undefined') {
    const saved = loadSavedPrompts();
    const filtered = saved.filter(p => p.id !== id);
    localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(filtered));
  }
};

export const getSavedPromptById = (id: string): SavedPrompt | null => {
  const saved = loadSavedPrompts();
  return saved.find(p => p.id === id) || null;
};

// 测试结果本地存储
export const saveTestResult = (
  promptId: string,
  task: string,
  template: string,
  variables: string[],
  variableValues: Record<string, string>,
  result: string
): TestResult => {
  const testResult: TestResult = {
    id: Date.now().toString(),
    promptId,
    task,
    template,
    variables,
    variableValues,
    result,
    createdAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    const saved = loadTestResults();
    saved.unshift(testResult); // 新的放在前面
    localStorage.setItem('prompt-generator-test-results', JSON.stringify(saved));
  }

  return testResult;
};

export const loadTestResults = (): TestResult[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prompt-generator-test-results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const deleteTestResult = (id: string) => {
  if (typeof window !== 'undefined') {
    const saved = loadTestResults();
    const filtered = saved.filter(r => r.id !== id);
    localStorage.setItem('prompt-generator-test-results', JSON.stringify(filtered));
  }
};

export const getTestResultById = (id: string): TestResult | null => {
  const saved = loadTestResults();
  return saved.find(r => r.id === id) || null;
};

// 从模板中提取变量的工具函数
export const extractVariablesFromTemplate = (template: string): string[] => {
  const pattern = /\{\$([^}]+)\}/g;
  const variables = new Set<string>();
  let match;
  while ((match = pattern.exec(template)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};

// 导出功能
export const exportUserData = (): ExportData => {
  const apiConfig = loadApiConfig();
  const savedPrompts = loadSavedPrompts();
  const testResults = loadTestResults();

  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    apiConfig,
    savedPrompts,
    testResults
  };
};

export const downloadExportFile = (data: ExportData, filename?: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `prompt-generator-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 导入功能
export const validateImportData = (data: unknown): { valid: boolean; error?: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format' };
  }

  const dataObj = data as Record<string, unknown>;

  if (!dataObj.version) {
    return { valid: false, error: 'Missing version information' };
  }

  if (!dataObj.exportedAt) {
    return { valid: false, error: 'Missing export timestamp' };
  }

  // 验证API配置
  if (dataObj.apiConfig && (
    typeof (dataObj.apiConfig as Record<string, unknown>).baseURL !== 'string' ||
    typeof (dataObj.apiConfig as Record<string, unknown>).apiKey !== 'string' ||
    typeof (dataObj.apiConfig as Record<string, unknown>).modelName !== 'string'
  )) {
    return { valid: false, error: 'Invalid API configuration format' };
  }

  // 验证保存的提示
  if (!Array.isArray(dataObj.savedPrompts)) {
    return { valid: false, error: 'Invalid saved prompts format' };
  }

  for (const prompt of dataObj.savedPrompts) {
    const promptObj = prompt as Record<string, unknown>;
    if (!promptObj.id || !promptObj.task || !promptObj.template || !promptObj.createdAt) {
      return { valid: false, error: 'Invalid prompt data structure' };
    }
  }

  // 验证测试结果
  if (!Array.isArray(dataObj.testResults)) {
    return { valid: false, error: 'Invalid test results format' };
  }

  for (const result of dataObj.testResults) {
    const resultObj = result as Record<string, unknown>;
    if (!resultObj.id || !resultObj.promptId || !resultObj.task || !resultObj.template || 
        !Array.isArray(resultObj.variables) || !resultObj.variableValues || !resultObj.createdAt) {
      return { valid: false, error: 'Invalid test result data structure' };
    }
  }

  return { valid: true };
};

export const importUserData = (data: ExportData, options: {
  importApiConfig: boolean;
  importPrompts: boolean;
  importTestResults: boolean;
  mergeData: boolean;
} = {
  importApiConfig: true,
  importPrompts: true,
  importTestResults: true,
  mergeData: true
}): ImportResult => {
  try {
    const validation = validateImportData(data);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || 'Invalid data format',
        imported: { apiConfig: false, promptsCount: 0, testResultsCount: 0 }
      };
    }

    const imported = {
      apiConfig: false,
      promptsCount: 0,
      testResultsCount: 0
    };

    // 导入API配置
    if (options.importApiConfig && data.apiConfig) {
      saveApiConfig(data.apiConfig);
      imported.apiConfig = true;
    }

    // 导入保存的提示
    if (options.importPrompts && data.savedPrompts.length > 0) {
      if (options.mergeData) {
        const existingPrompts = loadSavedPrompts();
        const existingIds = new Set(existingPrompts.map(p => p.id));
        const newPrompts = data.savedPrompts.filter(p => !existingIds.has(p.id));
        const mergedPrompts = [...newPrompts, ...existingPrompts];
        localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(mergedPrompts));
        imported.promptsCount = newPrompts.length;
      } else {
        localStorage.setItem('prompt-generator-saved-prompts', JSON.stringify(data.savedPrompts));
        imported.promptsCount = data.savedPrompts.length;
      }
    }

    // 导入测试结果
    if (options.importTestResults && data.testResults.length > 0) {
      if (options.mergeData) {
        const existingResults = loadTestResults();
        const existingIds = new Set(existingResults.map(r => r.id));
        const newResults = data.testResults.filter(r => !existingIds.has(r.id));
        const mergedResults = [...newResults, ...existingResults];
        localStorage.setItem('prompt-generator-test-results', JSON.stringify(mergedResults));
        imported.testResultsCount = newResults.length;
      } else {
        localStorage.setItem('prompt-generator-test-results', JSON.stringify(data.testResults));
        imported.testResultsCount = data.testResults.length;
      }
    }

    return {
      success: true,
      message: 'Data imported successfully',
      imported
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Import failed',
      imported: { apiConfig: false, promptsCount: 0, testResultsCount: 0 }
    };
  }
};

export const importFromFile = (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const result = importUserData(data);
        resolve(result);
      } catch {
        resolve({
          success: false,
          message: 'Failed to parse file content',
          imported: { apiConfig: false, promptsCount: 0, testResultsCount: 0 }
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
        imported: { apiConfig: false, promptsCount: 0, testResultsCount: 0 }
      });
    };

    reader.readAsText(file);
  });
};