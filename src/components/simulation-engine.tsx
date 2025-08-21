'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TestTube, Server, Clock, Save } from 'lucide-react';

interface SimulationMetrics {
  storageSavings: number;
  retrievalTime: number;
  datasetSize: number;
}

interface SimulationEngineProps {
  onMetricsChange: (metrics: SimulationMetrics) => void;
}

export function SimulationEngine({ onMetricsChange }: SimulationEngineProps) {
  const [datasetSize, setDatasetSize] = useState(500); // in GB
  const [auditRatio, setAuditRatio] = useState(10); // in %

  useEffect(() => {
    const newMetrics = {
      storageSavings: 100 - auditRatio,
      retrievalTime: (datasetSize * auditRatio) / 100 * 0.5,
      datasetSize,
    };
    onMetricsChange(newMetrics);
  }, [datasetSize, auditRatio, onMetricsChange]);
  
  const storageSavings = 100 - auditRatio;
  const retrievalTime = (datasetSize * auditRatio) / 100 * 0.5;

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="text-primary" />
          Simulation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="datasetSize">Dataset Size</Label>
            <span className="font-bold text-primary">{datasetSize.toLocaleString()} GB</span>
          </div>
          <Slider
            id="datasetSize"
            min={10}
            max={5000}
            step={10}
            value={[datasetSize]}
            onValueChange={(value) => setDatasetSize(value[0])}
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="auditRatio">Audit Ratio</Label>
            <span className="font-bold text-primary">{auditRatio}%</span>
          </div>
          <Slider
            id="auditRatio"
            min={1}
            max={100}
            step={1}
            value={[auditRatio]}
            onValueChange={(value) => setAuditRatio(value[0])}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex justify-center items-center gap-2"><Server size={16} /> Original Size</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{datasetSize.toLocaleString()} GB</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex justify-center items-center gap-2"><Save size={16} /> Storage Savings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-green-400">{storageSavings.toFixed(1)}%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex justify-center items-center gap-2"><Clock size={16}/> Retrieval Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{retrievalTime.toFixed(1)} ms</p>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
