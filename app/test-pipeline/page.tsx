"use client";

import PipelineContainer from "../(dashboard)/pipeline/components/PipelineContainer";

export default function TestPipelinePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Test Pipeline (No Auth)</h1>
      <PipelineContainer />
    </div>
  );
}
