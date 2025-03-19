/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function CPUCard({ cpu_info }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CPU Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>System CPU Metrics</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Attribute</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Architecture</TableCell>
              <TableCell>
                {cpu_info ? cpu_info.architecture : "ARMv7"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Model</TableCell>
              <TableCell>
                {cpu_info ? cpu_info.cpu_model : "Broadcom BCM2837"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Frequency</TableCell>
              <TableCell>
                {cpu_info ? cpu_info.cpu_frequency : "1.2 GHz"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Physical Cores</TableCell>
              <TableCell>{cpu_info ? cpu_info.cpu_cores : "4"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Logical Processors</TableCell>
              <TableCell>
                {cpu_info ? cpu_info.logical_processors : "4"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Usage</TableCell>
              <TableCell>{cpu_info ? cpu_info.cpu_usage : "15%"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Temperature</TableCell>
              <TableCell>{cpu_info ? cpu_info.temperature : "45°C"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
