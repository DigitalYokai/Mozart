import type {
  ExecutionMetrics,
  WorkflowMetrics,
} from "../domain/metrics.js";

export class MetricsCollector {
  private metrics: WorkflowMetrics = {
    totalAttempts: 0,
    totalDurationMs: 0,
    usage: {
      inputTokens: 0,
      cachedInputTokens: 0,
      outputTokens: 0,
    },
  };

  record(metrics?: ExecutionMetrics): void {
    this.metrics.totalAttempts++;

    if (!metrics) return;

    this.metrics.totalDurationMs += metrics.durationMs;

    this.metrics.usage.inputTokens +=
      metrics.usage.inputTokens;

    this.metrics.usage.cachedInputTokens +=
      metrics.usage.cachedInputTokens;

    this.metrics.usage.outputTokens +=
      metrics.usage.outputTokens;
  }

  getSummary(): WorkflowMetrics {
    return structuredClone(this.metrics);
  }
}
