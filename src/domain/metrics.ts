export interface TokenUsage {
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
}

export interface ExecutionMetrics {
  durationMs: number;
  usage: TokenUsage;
}
