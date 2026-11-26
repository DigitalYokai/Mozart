import type { ThreadEvent } from "@openai/codex-sdk";

export function handleCodexEvent(event: ThreadEvent): void {
  switch (event.type) {
    case "thread.started":
      console.log(`[CODEX] Thread: ${event.thread_id}`);
      break;

    case "turn.started":
      console.log("[CODEX] Turn started");
      break;

    case "item.started":
      if (event.item.type === "command_execution") {
        console.log(`[CODEX] Executing: ${event.item.command}`);
      }
      break;

    case "item.completed":
      switch (event.item.type) {
        case "command_execution":
          console.log(
            `[CODEX] Command ${event.item.status}: exit ${event.item.exit_code ?? "unknown"}`
          );
          break;

        case "file_change":
          for (const change of event.item.changes) {
            console.log(
              `[CODEX] File ${change.kind}: ${change.path} (${event.item.status})`
            );
          }
          break;
      }
      break;

    case "turn.completed":
      console.log("[CODEX] Turn completed");
      console.log("[USAGE]", event.usage);
      break;

    case "turn.failed":
      console.error("[CODEX] Turn failed:", event.error.message);
      break;

    case "error":
      console.error("[CODEX] Stream error:", event.message);
      break;
  }
}
