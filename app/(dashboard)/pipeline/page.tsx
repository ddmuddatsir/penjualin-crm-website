"use client";

import { PageLayout } from "@/components/layouts";
import PipelineContainer from "./components/PipelineContainer";

export default function PipelinePage() {
  return (
    <PageLayout
      title="Sales Pipeline"
      subtitle="Visualisasi dan kelola lead dalam pipeline penjualan"
      description="Drag and drop lead untuk mengubah status dalam pipeline"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pipeline" },
      ]}
    >
      <PipelineContainer />
    </PageLayout>
  );
}
