"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    trackEvent("web_vital", {
      metric_name: metric.name,
      metric_value: Number(metric.value.toFixed(2)),
      metric_id: metric.id,
      metric_label: metric.label,
    });
  });

  return null;
}
