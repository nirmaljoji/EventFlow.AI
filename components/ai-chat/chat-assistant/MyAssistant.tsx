"use client";

import { useEdgeRuntime } from "@assistant-ui/react";
import { Thread } from "@/components/ai-chat/chat-assistant/thread";
import { ThreadList } from "@/components/ai-chat/chat-assistant/thread-list";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { getApiUrl } from "@/lib/utils_url";

export function MyAssistant() {
  const runtime = useEdgeRuntime({
    api: getApiUrl() + "/api/chat",
    unstable_AISDKInterop: true,
  });

  if (!runtime) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}