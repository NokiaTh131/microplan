import React, { useState, useMemo } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  // ShieldX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  // Eye,
  Lock,
  Key,
  Network,
  Database,
  Settings,
  FileText,
  // TrendingUp,
  // TrendingDown,
  Info,
  ExternalLink,
  Download,
  RefreshCw,
  Target,
  Activity,
} from "lucide-react";
import { useArchitectureStore } from "../../stores/architectureStore";
import {
  SecurityAnalyzer,
  // SecurityVulnerability,
  // SecurityCheck,
  // ThreatModel,
  // ComplianceFramework,
} from "../../utils/securityAnalyzer";

const SecurityPanel: React.FC = () => {
  const { nodes, edges } = useArchitectureStore();
  const [activeTab, setActiveTab] = useState<
    "overview" | "vulnerabilities" | "checks" | "threats" | "compliance"
  >("overview");
  const [autoRefresh, setAutoRefresh] = useState(false);
  // const [selectedVulnerability, setSelectedVulnerability] =
  //   useState<SecurityVulnerability | null>(null);
  // Can be used later for vulnerability details

  const analyzer = useMemo(
    () => new SecurityAnalyzer(nodes, edges),
    [nodes, edges]
  );

  const analysis = useMemo(() => analyzer.analyzeArchitecture(), [analyzer]);
  const {
    vulnerabilities,
    securityChecks,
    metrics,
    threatModel,
    complianceStatus,
  } = analysis;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "info":
        return "text-slate-600 bg-slate-50 border-slate-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
      case "compliant":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
      case "partial":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "fail":
      case "non-compliant":
        return "text-red-600 bg-red-50 border-red-200";
      case "skip":
      case "not-applicable":
        return "text-slate-400 bg-slate-50 border-slate-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "very-low":
        return "text-green-600";
      case "low":
        return "text-blue-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-orange-600";
      case "critical":
      case "very-high":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
      case "compliant":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
      case "partial":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "fail":
      case "non-compliant":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "skip":
      case "not-applicable":
        return <Target className="w-4 h-4 text-slate-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getVulnerabilityIcon = (type: string) => {
    switch (type) {
      case "authentication":
        return <Key className="w-4 h-4" />;
      case "authorization":
        return <Lock className="w-4 h-4" />;
      case "encryption":
        return <Shield className="w-4 h-4" />;
      case "network":
        return <Network className="w-4 h-4" />;
      case "data":
        return <Database className="w-4 h-4" />;
      case "configuration":
        return <Settings className="w-4 h-4" />;
      case "compliance":
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatScore = (score: number) => {
    return score.toFixed(0);
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security Analysis
          </h3>
          <p className="text-sm text-slate-600">
            Comprehensive security assessment and vulnerability analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg border transition-colors ${
              autoRefresh
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "border-slate-300 text-slate-600"
            }`}
            title="Auto refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
          </button>
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-2 lg:col-span-1 p-4 bg-white border border-slate-200 rounded-lg">
          <div className="text-center">
            <div
              className={`text-3xl font-bold mb-1 ${getRiskColor(
                metrics.riskLevel
              )}`}
            >
              {formatScore(metrics.overallScore)}
            </div>
            <div className="text-sm text-slate-600">Security Score</div>
            <div
              className={`text-xs mt-1 font-medium ${getRiskColor(
                metrics.riskLevel
              )}`}
            >
              {metrics.riskLevel.replace("-", " ").toUpperCase()} RISK
            </div>
          </div>
        </div>

        {Object.entries(metrics.securityControls).map(([control, score]) => (
          <div
            key={control}
            className="p-3 bg-white border border-slate-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-600 capitalize">
                {control.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span
                className={`text-sm font-bold ${getRiskColor(
                  score >= 80
                    ? "very-low"
                    : score >= 60
                    ? "low"
                    : score >= 40
                    ? "medium"
                    : "high"
                )}`}
              >
                {formatScore(score)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  score >= 80
                    ? "bg-green-500"
                    : score >= 60
                    ? "bg-blue-500"
                    : score >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critical Issues Alert */}
      {vulnerabilities.filter((v) => v.severity === "critical").length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">
              Critical Security Issues Detected
            </span>
          </div>
          <ul className="space-y-1 text-sm text-red-700">
            {vulnerabilities
              .filter((v) => v.severity === "critical")
              .map((vuln) => (
                <li key={vuln.id}>
                  • {vuln.title} in {vuln.service}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Vulnerability Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {Object.entries(metrics.vulnerabilityCount).map(([severity, count]) => (
          <div
            key={severity}
            className={`p-3 rounded-lg border ${getSeverityColor(severity)}`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs font-medium capitalize">{severity}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(
          [
            {
              id: "overview",
              label: "Overview",
              icon: <Activity className="w-4 h-4" />,
            },
            {
              id: "vulnerabilities",
              label: "Vulnerabilities",
              icon: <ShieldAlert className="w-4 h-4" />,
            },
            {
              id: "checks",
              label: "Checks",
              icon: <CheckCircle className="w-4 h-4" />,
            },
            {
              id: "threats",
              label: "Threats",
              icon: <Target className="w-4 h-4" />,
            },
            {
              id: "compliance",
              label: "Compliance",
              icon: <FileText className="w-4 h-4" />,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-700 mb-3">
                Security Assessment Summary
              </h4>
              <div className="grid gap-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        Overall Security Posture
                      </span>
                    </div>
                    <div
                      className={`font-bold ${getRiskColor(metrics.riskLevel)}`}
                    >
                      {metrics.overallScore}/100
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    Your architecture has a{" "}
                    <strong className={getRiskColor(metrics.riskLevel)}>
                      {metrics.riskLevel.replace("-", " ")}
                    </strong>{" "}
                    security risk level.
                  </div>
                  <div className="text-xs text-slate-500">
                    Based on {vulnerabilities.length} vulnerabilities and{" "}
                    {securityChecks.length} security checks
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h5 className="font-medium text-slate-700 mb-2">
                      Top Issues
                    </h5>
                    <div className="space-y-2">
                      {vulnerabilities.slice(0, 3).map((vuln) => (
                        <div key={vuln.id} className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              getSeverityColor(vuln.severity).split(" ")[0]
                            }`}
                          />
                          <span className="text-sm text-slate-600 truncate">
                            {vuln.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h5 className="font-medium text-slate-700 mb-2">
                      Security Controls
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(metrics.securityControls)
                        .slice(0, 3)
                        .map(([control, score]) => (
                          <div
                            key={control}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-slate-600 capitalize">
                              {control.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span
                              className={`text-sm font-medium ${getRiskColor(
                                score >= 70
                                  ? "very-low"
                                  : score >= 50
                                  ? "medium"
                                  : "high"
                              )}`}
                            >
                              {formatScore(score)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vulnerabilities Tab */}
        {activeTab === "vulnerabilities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">
                Security Vulnerabilities
              </h4>
              <span className="text-sm text-slate-500">
                {vulnerabilities.length} total issues
              </span>
            </div>

            {vulnerabilities.length === 0 ? (
              <div className="text-center py-8">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-500 mb-2">
                  No Vulnerabilities Detected
                </h4>
                <p className="text-slate-400">
                  Your architecture appears to be secure!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {vulnerabilities.map((vuln) => (
                  <div
                    key={vuln.id}
                    className={`p-4 border rounded-lg ${getSeverityColor(
                      vuln.severity
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getVulnerabilityIcon(vuln.type)}
                        <span className="font-medium">{vuln.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                          {vuln.type}
                        </span>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                          {vuln.severity}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Service:{" "}
                      </span>
                      <span className="text-sm text-slate-600">
                        {vuln.service}
                      </span>
                    </div>

                    <p className="text-sm mb-2">{vuln.description}</p>
                    <p className="text-xs text-slate-600 mb-3">
                      <strong>Impact:</strong> {vuln.impact}
                    </p>

                    {vuln.cvssScore && (
                      <div className="mb-3 text-xs">
                        <span className="font-medium">CVSS Score: </span>
                        <span
                          className={`font-bold ${
                            vuln.cvssScore >= 7
                              ? "text-red-600"
                              : vuln.cvssScore >= 4
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {vuln.cvssScore}
                        </span>
                        {vuln.cweId && (
                          <span className="ml-2">
                            <span className="font-medium">CWE: </span>
                            <a
                              href={`https://cwe.mitre.org/data/definitions/${vuln.cweId.replace(
                                "CWE-",
                                ""
                              )}.html`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              {vuln.cweId}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </span>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-medium mb-1">
                        Remediation Steps:
                      </div>
                      <ul className="text-xs space-y-1">
                        {vuln.remediation.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Checks Tab */}
        {activeTab === "checks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Security Checks</h4>
              <span className="text-sm text-slate-500">
                {securityChecks.filter((c) => c.status === "pass").length}/
                {securityChecks.filter((c) => c.status !== "skip").length}{" "}
                passed
              </span>
            </div>

            <div className="space-y-3">
              {securityChecks.map((check) => (
                <div
                  key={check.id}
                  className={`p-4 border rounded-lg ${getStatusColor(
                    check.status
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <span className="font-medium">{check.name}</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                      {check.category}
                    </span>
                  </div>

                  <p className="text-sm mb-2">{check.description}</p>

                  {check.recommendation && (
                    <div className="text-xs">
                      <span className="font-medium">Recommendation: </span>
                      <span>{check.recommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threat Model Tab */}
        {activeTab === "threats" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">Threat Model</h4>
              <span className="text-sm text-slate-500">
                {threatModel.length} threats identified
              </span>
            </div>

            <div className="space-y-3">
              {threatModel.map((threat) => (
                <div
                  key={threat.id}
                  className="p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-600" />
                      <span className="font-medium">{threat.threat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(
                          threat.likelihood
                        )} bg-white`}
                      >
                        {threat.likelihood.replace("-", " ")} likelihood
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(
                          threat.impact
                        )} bg-white`}
                      >
                        {threat.impact.replace("-", " ")} impact
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100">
                        Risk: {threat.riskRating}/25
                      </span>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{threat.description}</p>

                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">
                      Affected Assets:
                    </div>
                    <div className="text-xs text-slate-600">
                      {threat.affectedAssets.join(", ")}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium mb-1">Mitigations:</div>
                    <ul className="text-xs space-y-1">
                      {threat.mitigations.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">
                Compliance Frameworks
              </h4>
              <span className="text-sm text-slate-500">
                {complianceStatus.length} frameworks assessed
              </span>
            </div>

            <div className="space-y-4">
              {complianceStatus.map((framework) => (
                <div
                  key={framework.id}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-slate-800">
                        {framework.name}
                      </h5>
                      <p className="text-sm text-slate-600">
                        {framework.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-700">
                        {
                          framework.requirements.filter(
                            (r) => r.status === "compliant"
                          ).length
                        }
                        /{framework.requirements.length} compliant
                      </div>
                      <div className="text-xs text-slate-500">
                        {Math.round(
                          (framework.requirements.filter(
                            (r) => r.status === "compliant"
                          ).length /
                            framework.requirements.length) *
                            100
                        )}
                        % complete
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {framework.requirements.map((req) => (
                      <div
                        key={req.id}
                        className={`p-3 rounded border ${getStatusColor(
                          req.status
                        )}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {req.title}
                          </span>
                          {getStatusIcon(req.status)}
                        </div>
                        <p className="text-xs mb-2">{req.description}</p>
                        {req.remediation && req.remediation.length > 0 && (
                          <div className="text-xs">
                            <span className="font-medium">Actions needed:</span>
                            <ul className="mt-1 space-y-1">
                              {req.remediation.map((action, index) => (
                                <li key={index}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPanel;
