import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive,
  Copy,
  RefreshCw,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";
import {
  ArchitectureAnalyzer,
  AnalysisResult,
} from "../../utils/architectureAnalyzer";

const ArchitectureAnalysis: React.FC = () => {
  const { nodes, edges } = useArchitectureStore();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);

    // Simulate async analysis
    await new Promise((resolve) => setTimeout(resolve, 500));

    const analyzer = new ArchitectureAnalyzer(nodes, edges);
    const result = analyzer.analyze();
    setAnalysis(result);
    setIsAnalyzing(false);
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0) {
      runAnalysis();
    } else {
      setAnalysis(null);
    }
  }, [nodes, edges, runAnalysis]);

  if (!analysis && nodes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6">
        <div className="text-center text-slate-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Architecture Analysis</h3>
          <p className="text-sm">
            Add services to your architecture to see analysis results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Architecture Analysis
          </h3>
        </div>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}
          />
          {isAnalyzing ? "Analyzing..." : "Refresh"}
        </button>
      </div>

      {analysis && (
        <>
          {/* Resource Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Total CPU
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {analysis.resourceRequirements.totalCpu}
              </div>
              <div className="text-xs text-blue-600">cores</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Total Memory
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {(analysis.resourceRequirements.totalMemory / 1024).toFixed(1)}
              </div>
              <div className="text-xs text-green-600">GB</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Total Instances
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {analysis.resourceRequirements.totalReplicas}
              </div>
              <div className="text-xs text-purple-600">replicas</div>
            </div>
          </div>

          {/* Issues */}
          <div className="space-y-4">
            {/* Dependency Cycles */}
            {analysis.dependencyCycles.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">
                    Dependency Cycles Detected
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.dependencyCycles.map((cycle, index) => (
                    <div
                      key={index}
                      className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded"
                    >
                      {cycle}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottlenecks */}
            {analysis.bottlenecks.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">
                    Potential Bottlenecks
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.bottlenecks.map((bottleneck, index) => (
                    <div
                      key={index}
                      className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded"
                    >
                      {bottleneck}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single Points of Failure */}
            {analysis.singlePointsOfFailure.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">
                    Single Points of Failure
                  </h4>
                </div>
                <div className="space-y-2">
                  {analysis.singlePointsOfFailure.map((spof, index) => (
                    <div
                      key={index}
                      className="text-sm text-orange-700 bg-orange-100 p-2 rounded"
                    >
                      {spof}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Recommendations</h4>
            </div>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="text-sm text-blue-700 bg-blue-100 p-2 rounded flex items-start gap-2"
                >
                  <span className="text-blue-500 mt-0.5">•</span>
                  {recommendation}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-slate-600" />
              <h4 className="font-semibold text-slate-700">Analysis Summary</h4>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <div>Services: {nodes.length}</div>
              <div>Connections: {edges.length}</div>
              <div>
                Issues Found:{" "}
                {analysis.dependencyCycles.length +
                  analysis.bottlenecks.length +
                  analysis.singlePointsOfFailure.length}
              </div>
              <div>
                Health Score:{" "}
                {nodes.length > 0
                  ? Math.max(
                      0,
                      100 -
                        (analysis.dependencyCycles.length * 30 +
                          analysis.bottlenecks.length * 20 +
                          analysis.singlePointsOfFailure.length * 15)
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArchitectureAnalysis;
