export interface TokenUsage {
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
}

export interface ExecutionMetrics {
  durationMs: number;
  usage: TokenUsage;
}

export interface WorkflowMetrics {
  totalAttempts: number;
  totalDurationMs: number;
  usage: TokenUsage;
}
