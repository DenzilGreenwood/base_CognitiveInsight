'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TestTube, Server, Clock, Save, Info } from 'lucide-react';
import { Separator } from './ui/separator';

interface SimulationMetrics {
  storageSavings: number;
  retrievalTime: number;
  datasetSize: number;
  auditRatio: number;
}

interface SimulationEngineProps {
  onMetricsChange: (metrics: SimulationMetrics) => void;
}

export function SimulationEngine({ onMetricsChange }: SimulationEngineProps) {
  const [datasetSize, setDatasetSize] = useState(500); // in GB
  const [auditRatio, setAuditRatio] = useState(10); // in %

  const memoizedOnMetricsChange = useCallback(onMetricsChange, [onMetricsChange]);

  useEffect(() => {
    const newMetrics = {
      storageSavings: 100 - auditRatio,
      retrievalTime: (datasetSize * auditRatio) / 100 * 0.5,
      datasetSize,
      auditRatio,
    };
    memoizedOnMetricsChange(newMetrics);
  }, [datasetSize, auditRatio, memoizedOnMetricsChange]);
  
  const storageSavings = 100 - auditRatio;
  const persistentFootprint = 100 - storageSavings;
  const retrievalTime = (datasetSize * auditRatio) / 100 * 0.5;

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="text-primary" />
          Simulation Engine (Demonstration Only)
        </CardTitle>
        <CardDescription>
          Results are simulated; actual performance varies by workload and environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="datasetSize" className="text-sm">Dataset Size (input)</Label>
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
            <Label htmlFor="auditRatio" className="text-sm">Audit Ratio (input)</Label>
            <span className="font-bold text-primary">{auditRatio}%</span>
          </div>
           <p className="text-xs text-muted-foreground -mt-2">Higher ratio means more coverage and more capsules.</p>
          <Slider
            id="auditRatio"
            min={1}
            max={100}
            step={1}
            value={[auditRatio]}
            onValueChange={(value) => setAuditRatio(value[0])}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
                <p className="text-muted-foreground">Baseline Size</p>
                <p className="font-semibold">{datasetSize.toLocaleString()} GB</p>
            </div>
             <div className="space-y-1">
                <p className="text-muted-foreground">Persistent Audit Footprint (capsules)</p>
                <p className="font-semibold text-green-400">≈ {persistentFootprint.toFixed(0)}% ({((datasetSize * persistentFootprint) / 100).toFixed(1)} GB)</p>
            </div>
             <div className="space-y-1">
                <p className="text-muted-foreground">Retrieval Time (per capsule, warm cache)</p>
                <p className="font-semibold">~ {retrievalTime.toFixed(1)} ms</p>
            </div>
            <div className="space-y-1">
                <p className="text-muted-foreground">Temporary Audit Workspace</p>
                <p className="font-semibold">0 – variable</p>
            </div>
             <div className="space-y-1">
                <p className="text-muted-foreground">Persistent Storage (after audit)</p>
                <p className="font-semibold">Unchanged (capsules only)</p>
            </div>
             <div className="space-y-1">
                <p className="text-muted-foreground">Temporary Storage (during audit)</p>
                <p className="font-semibold">Up to size of verified samples</p>
            </div>
        </div>
        <Separator />
         <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><Info size={16}/> Notes</h4>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                <li>Storage reduction stays high because capsules store hashes + metadata, not raw data.</li>
                <li>Temporary workspace appears only if you fetch artifacts for verification; it’s not persisted unless you choose to.</li>
                 <li>Retrieval time is higher for cold cache, slow networks, or when fetching large artifacts.</li>
                <li>Savings may dip if you persist evidence bundles (a policy choice) or with many very small artifacts.</li>
                <li>Patent-pending; cryptographic details withheld.</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
