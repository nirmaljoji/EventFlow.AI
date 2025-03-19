"use client";

import { useEdgeRuntime } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { AssistantRuntimeProvider } from "@assistant-ui/react";


export function MyAssistant() {
  const runtime = useEdgeRuntime({
    api: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/chat",
    unstable_AISDKInterop: true,
  });

  return (
    <AssistantRuntimeProvider 
    runtime={runtime}
    >
    <div className="grid h-full grid-cols-[200px_1fr]">
      <ThreadList />
      <Thread />
    </div>
    </AssistantRuntimeProvider>
  );
}