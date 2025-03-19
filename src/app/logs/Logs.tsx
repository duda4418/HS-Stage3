import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function Logs() {
  const logs = [
    "2025-03-19 09:30:00 INFO: Application starting...",
    "2025-03-19 09:30:02 INFO: Database connected.",
    "2025-03-19 09:30:05 WARN: Deprecated API usage detected.",
    "2025-03-19 09:30:10 ERROR: Failed to load configuration file.",
    "2025-03-19 09:30:15 INFO: Application running.",
  ];

  return (
    <Card className="bg-black text-green-500 h-19/20">
      <CardHeader>
        <CardTitle className="text-green-500">Terminal Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          readOnly
          value={logs.join("\n")}
          className="bg-black text-green-500 font-mono resize-none"
          rows={10}
        />
      </CardContent>
    </Card>
  );
}
