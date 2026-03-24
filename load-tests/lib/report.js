import { TARGETS } from "./config.js";

function targetRows() {
  const rows = [];
  for (const [key, target] of Object.entries(TARGETS.endpoints)) {
    rows.push(
      `| ${key} | ${target.method} ${target.path} | <= ${target.p95_ms}ms | <= ${target.max_throughput_rps} rps |`,
    );
  }
  return rows.join("\n");
}

export function handleSummary(data) {
  const md = [
    "# k6 Load Test Report",
    "",
    "## Targets",
    "",
    "| Endpoint | Route | p95 Target | Max Throughput Target |",
    "|---|---|---:|---:|",
    targetRows(),
    "",
    "## Aggregated Metrics",
    "",
    `- http_req_duration p50: ${data.metrics.http_req_duration.values["p(50)"]} ms`,
    `- http_req_duration p95: ${data.metrics.http_req_duration.values["p(95)"]} ms`,
    `- http_req_duration p99: ${data.metrics.http_req_duration.values["p(99)"]} ms`,
    `- error rate: ${data.metrics.http_req_failed.values.rate}`,
    `- throughput (http_reqs/s): ${data.metrics.http_reqs.values.rate}`,
    "",
  ].join("\n");

  return {
    stdout: `${md}\n`,
    "load-tests/results/latest-summary.md": md,
  };
}
