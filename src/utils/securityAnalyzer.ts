import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../stores/architectureStore';

export interface SecurityVulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: 'authentication' | 'authorization' | 'encryption' | 'network' | 'data' | 'configuration' | 'compliance';
  service: string;
  title: string;
  description: string;
  impact: string;
  remediation: string[];
  cweId?: string;
  cvssScore?: number;
  affectedEndpoints?: string[];
}

export interface SecurityCheck {
  id: string;
  name: string;
  category: 'authentication' | 'authorization' | 'encryption' | 'network' | 'data' | 'configuration' | 'compliance';
  status: 'pass' | 'fail' | 'warning' | 'skip';
  description: string;
  recommendation?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  evidence?: string;
  remediation?: string[];
}

export interface SecurityMetrics {
  overallScore: number; // 0-100
  riskLevel: 'very-low' | 'low' | 'medium' | 'high' | 'critical';
  vulnerabilityCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  complianceScore: number; // 0-100
  securityControls: {
    authentication: number;
    authorization: number;
    encryption: number;
    monitoring: number;
    networkSecurity: number;
  };
}

export interface ThreatModel {
  id: string;
  threat: string;
  description: string;
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  riskRating: number; // 1-25
  mitigations: string[];
  affectedAssets: string[];
}

class SecurityAnalyzer {
  private nodes: Node[];
  private edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // Main security analysis
  analyzeArchitecture(): {
    vulnerabilities: SecurityVulnerability[];
    securityChecks: SecurityCheck[];
    metrics: SecurityMetrics;
    threatModel: ThreatModel[];
    complianceStatus: ComplianceFramework[];
  } {
    const vulnerabilities = this.identifyVulnerabilities();
    const securityChecks = this.performSecurityChecks();
    const metrics = this.calculateSecurityMetrics(vulnerabilities, securityChecks);
    const threatModel = this.generateThreatModel();
    const complianceStatus = this.assessCompliance();

    return {
      vulnerabilities,
      securityChecks,
      metrics,
      threatModel,
      complianceStatus,
    };
  }

  // Identify security vulnerabilities
  private identifyVulnerabilities(): SecurityVulnerability[] {
    const vulnerabilities: SecurityVulnerability[] = [];

    // Check for missing authentication service
    const hasAuthService = this.nodes.some(node => 
      (node.data as NodeData).config.type === 'auth' || 
      (node.data as NodeData).config.name.toLowerCase().includes('auth')
    );

    if (!hasAuthService && this.nodes.length > 2) {
      vulnerabilities.push({
        id: 'missing-auth',
        severity: 'high',
        type: 'authentication',
        service: 'Architecture',
        title: 'Missing Authentication Service',
        description: 'No dedicated authentication service found in the architecture',
        impact: 'Potential unauthorized access to services and data',
        remediation: [
          'Add a dedicated authentication service',
          'Implement OAuth 2.0 or similar standard',
          'Configure authentication for all API endpoints',
          'Implement proper session management'
        ],
        cweId: 'CWE-287',
        cvssScore: 7.5
      });
    }

    // Check for missing API Gateway
    const hasGateway = this.nodes.some(node => 
      (node.data as NodeData).config.type === 'gateway'
    );

    if (!hasGateway && this.nodes.length > 3) {
      vulnerabilities.push({
        id: 'missing-gateway',
        severity: 'medium',
        type: 'network',
        service: 'Architecture',
        title: 'Missing API Gateway',
        description: 'No API Gateway found to centralize security controls',
        impact: 'Distributed security policies, inconsistent access control',
        remediation: [
          'Implement API Gateway',
          'Centralize authentication and authorization',
          'Add rate limiting and throttling',
          'Implement request/response filtering'
        ],
        cweId: 'CWE-284',
        cvssScore: 5.3
      });
    }

    // Check for unencrypted communications
    this.edges.forEach(edge => {
      const sourceNode = this.nodes.find(n => n.id === edge.source);
      const targetNode = this.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const edgeType = (edge as any).type;
        if (edgeType !== 'encrypted' && !edgeType?.includes('tls')) {
          vulnerabilities.push({
            id: `unencrypted-${edge.id}`,
            severity: 'high',
            type: 'encryption',
            service: `${(sourceNode.data as NodeData).config.name} → ${(targetNode.data as NodeData).config.name}`,
            title: 'Unencrypted Communication',
            description: 'Communication between services is not encrypted',
            impact: 'Data in transit can be intercepted and manipulated',
            remediation: [
              'Enable TLS/SSL encryption',
              'Use mutual TLS (mTLS) for service-to-service communication',
              'Implement certificate management',
              'Enforce encryption policies'
            ],
            cweId: 'CWE-319',
            cvssScore: 7.4
          });
        }
      }
    });

    // Check for external services without security controls
    this.nodes.forEach(node => {
      const config = (node.data as NodeData).config;
      if (config.type === 'external') {
        vulnerabilities.push({
          id: `external-${node.id}`,
          severity: 'medium',
          type: 'network',
          service: config.name,
          title: 'External Service Dependency',
          description: 'Dependency on external service without security assessment',
          impact: 'Potential data leakage, service disruption, supply chain attacks',
          remediation: [
            'Conduct security assessment of external service',
            'Implement API key management',
            'Add circuit breakers and timeouts',
            'Monitor external service communications',
            'Implement data sanitization'
          ],
          cweId: 'CWE-346',
          cvssScore: 6.1
        });
      }
    });

    // Check for databases without encryption
    this.nodes.forEach(node => {
      const config = (node.data as NodeData).config;
      if (config.type === 'database') {
        vulnerabilities.push({
          id: `db-encryption-${node.id}`,
          severity: 'high',
          type: 'data',
          service: config.name,
          title: 'Database Encryption Not Verified',
          description: 'Database encryption status is not explicitly configured',
          impact: 'Sensitive data may be stored unencrypted',
          remediation: [
            'Enable database encryption at rest',
            'Implement field-level encryption for sensitive data',
            'Use encrypted connections to database',
            'Implement proper key management',
            'Regular security audits'
          ],
          cweId: 'CWE-312',
          cvssScore: 7.2
        });
      }
    });

    // Check for single points of failure in security
    if (hasAuthService) {
      const authNodes = this.nodes.filter(node => 
        (node.data as NodeData).config.type === 'auth' ||
        (node.data as NodeData).config.name.toLowerCase().includes('auth')
      );
      
      authNodes.forEach(node => {
        const config = (node.data as NodeData).config;
        if (config.replicas === 1) {
          vulnerabilities.push({
            id: `auth-spof-${node.id}`,
            severity: 'high',
            type: 'configuration',
            service: config.name,
            title: 'Authentication Service Single Point of Failure',
            description: 'Authentication service has only one replica',
            impact: 'Complete authentication failure if service goes down',
            remediation: [
              'Increase authentication service replicas',
              'Implement high availability configuration',
              'Add health checks and monitoring',
              'Configure automatic failover'
            ],
            cweId: 'CWE-1188',
            cvssScore: 6.8
          });
        }
      });
    }

    return vulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  // Perform security checks
  private performSecurityChecks(): SecurityCheck[] {
    const checks: SecurityCheck[] = [];

    // Authentication checks
    const hasAuth = this.nodes.some(n => (n.data as NodeData).config.type === 'auth');
    checks.push({
      id: 'auth-service',
      name: 'Authentication Service',
      category: 'authentication',
      status: hasAuth ? 'pass' : 'fail',
      description: 'Verify presence of authentication service',
      recommendation: hasAuth ? undefined : 'Add dedicated authentication service'
    });

    // Authorization checks
    const hasGateway = this.nodes.some(n => (n.data as NodeData).config.type === 'gateway');
    checks.push({
      id: 'api-gateway',
      name: 'API Gateway',
      category: 'authorization',
      status: hasGateway ? 'pass' : 'warning',
      description: 'Check for centralized authorization point',
      recommendation: hasGateway ? undefined : 'Consider implementing API Gateway for centralized authorization'
    });

    // Encryption checks
    const encryptedEdges = this.edges.filter(e => (e as any).type?.includes('encrypted') || (e as any).type?.includes('tls'));
    const encryptionRatio = this.edges.length > 0 ? encryptedEdges.length / this.edges.length : 1;
    checks.push({
      id: 'encryption',
      name: 'Communication Encryption',
      category: 'encryption',
      status: encryptionRatio >= 0.8 ? 'pass' : encryptionRatio >= 0.5 ? 'warning' : 'fail',
      description: `${(encryptionRatio * 100).toFixed(1)}% of communications are encrypted`,
      recommendation: encryptionRatio < 0.8 ? 'Enable TLS/SSL for all service communications' : undefined
    });

    // Network security checks
    const externalServices = this.nodes.filter(n => (n.data as NodeData).config.type === 'external');
    checks.push({
      id: 'external-services',
      name: 'External Service Dependencies',
      category: 'network',
      status: externalServices.length === 0 ? 'pass' : externalServices.length <= 2 ? 'warning' : 'fail',
      description: `${externalServices.length} external service dependencies`,
      recommendation: externalServices.length > 0 ? 'Review and secure external service integrations' : undefined
    });

    // Data protection checks
    const databases = this.nodes.filter(n => (n.data as NodeData).config.type === 'database');
    checks.push({
      id: 'database-security',
      name: 'Database Security',
      category: 'data',
      status: databases.length > 0 ? 'warning' : 'skip',
      description: 'Database encryption and access controls',
      recommendation: databases.length > 0 ? 'Verify database encryption and access controls' : undefined
    });

    // Monitoring checks
    const hasMonitoring = this.nodes.some(n => (n.data as NodeData).config.type === 'monitoring');
    checks.push({
      id: 'security-monitoring',
      name: 'Security Monitoring',
      category: 'configuration',
      status: hasMonitoring ? 'pass' : 'fail',
      description: 'Security event monitoring and logging',
      recommendation: hasMonitoring ? undefined : 'Implement security monitoring and SIEM'
    });

    return checks;
  }

  // Calculate security metrics
  private calculateSecurityMetrics(vulnerabilities: SecurityVulnerability[], checks: SecurityCheck[]): SecurityMetrics {
    const vulnCount = {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      info: vulnerabilities.filter(v => v.severity === 'info').length,
    };

    // Calculate overall score based on vulnerabilities and checks
    let score = 100;
    score -= vulnCount.critical * 20;
    score -= vulnCount.high * 10;
    score -= vulnCount.medium * 5;
    score -= vulnCount.low * 2;

    const passedChecks = checks.filter(c => c.status === 'pass').length;
    const totalChecks = checks.filter(c => c.status !== 'skip').length;
    const checkScore = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;
    
    const overallScore = Math.max(0, Math.min(100, (score + checkScore) / 2));

    const getRiskLevel = (score: number): SecurityMetrics['riskLevel'] => {
      if (score >= 80) return 'very-low';
      if (score >= 60) return 'low';
      if (score >= 40) return 'medium';
      if (score >= 20) return 'high';
      return 'critical';
    };

    return {
      overallScore: Math.round(overallScore),
      riskLevel: getRiskLevel(overallScore),
      vulnerabilityCount: vulnCount,
      complianceScore: Math.round(checkScore),
      securityControls: {
        authentication: this.assessAuthenticationControls(),
        authorization: this.assessAuthorizationControls(),
        encryption: this.assessEncryptionControls(),
        monitoring: this.assessMonitoringControls(),
        networkSecurity: this.assessNetworkSecurityControls(),
      },
    };
  }

  // Generate threat model
  private generateThreatModel(): ThreatModel[] {
    const threats: ThreatModel[] = [];

    // Data breach threat
    const sensitiveServices = this.nodes.filter(n => 
      ['database', 'auth', 'payment'].includes((n.data as NodeData).config.type) ||
      (n.data as NodeData).config.name.toLowerCase().includes('user')
    );

    if (sensitiveServices.length > 0) {
      threats.push({
        id: 'data-breach',
        threat: 'Data Breach',
        description: 'Unauthorized access to sensitive data through compromised services',
        likelihood: 'medium',
        impact: 'very-high',
        riskRating: 15,
        mitigations: [
          'Implement strong authentication',
          'Enable data encryption',
          'Apply principle of least privilege',
          'Regular security audits',
          'Data loss prevention tools'
        ],
        affectedAssets: sensitiveServices.map(s => (s.data as NodeData).config.name)
      });
    }

    // DDoS attack threat
    const publicServices = this.nodes.filter(n => 
      ['gateway', 'api'].includes((n.data as NodeData).config.type)
    );

    if (publicServices.length > 0) {
      threats.push({
        id: 'ddos-attack',
        threat: 'Distributed Denial of Service (DDoS)',
        description: 'Overwhelming services with malicious traffic to cause service disruption',
        likelihood: 'medium',
        impact: 'high',
        riskRating: 12,
        mitigations: [
          'Implement rate limiting',
          'Use CDN and DDoS protection',
          'Auto-scaling configuration',
          'Traffic monitoring and alerting',
          'Circuit breaker patterns'
        ],
        affectedAssets: publicServices.map(s => (s.data as NodeData).config.name)
      });
    }

    // Man-in-the-middle attack
    const unencryptedConnections = this.edges.filter(e => 
      !(e as any).type?.includes('encrypted') && !(e as any).type?.includes('tls')
    );

    if (unencryptedConnections.length > 0) {
      threats.push({
        id: 'mitm-attack',
        threat: 'Man-in-the-Middle Attack',
        description: 'Interception and manipulation of unencrypted communications',
        likelihood: 'low',
        impact: 'high',
        riskRating: 8,
        mitigations: [
          'Enable TLS/SSL encryption',
          'Implement certificate pinning',
          'Use mutual TLS (mTLS)',
          'Regular certificate rotation',
          'Network segmentation'
        ],
        affectedAssets: unencryptedConnections.map(e => {
          const source = this.nodes.find(n => n.id === e.source);
          const target = this.nodes.find(n => n.id === e.target);
          return `${(source?.data as NodeData)?.config.name} → ${(target?.data as NodeData)?.config.name}`;
        })
      });
    }

    // Insider threat
    if (this.nodes.length > 5) {
      threats.push({
        id: 'insider-threat',
        threat: 'Insider Threat',
        description: 'Malicious or accidental actions by internal users with system access',
        likelihood: 'low',
        impact: 'high',
        riskRating: 8,
        mitigations: [
          'Implement role-based access control',
          'Regular access reviews',
          'User activity monitoring',
          'Separation of duties',
          'Security awareness training'
        ],
        affectedAssets: ['All Services']
      });
    }

    // Supply chain attack
    const externalServices = this.nodes.filter(n => (n.data as NodeData).config.type === 'external');
    if (externalServices.length > 0) {
      threats.push({
        id: 'supply-chain-attack',
        threat: 'Supply Chain Attack',
        description: 'Compromise through third-party services or dependencies',
        likelihood: 'low',
        impact: 'high',
        riskRating: 8,
        mitigations: [
          'Vendor security assessments',
          'Dependency scanning',
          'API security testing',
          'Network monitoring',
          'Incident response planning'
        ],
        affectedAssets: externalServices.map(s => (s.data as NodeData).config.name)
      });
    }

    return threats.sort((a, b) => b.riskRating - a.riskRating);
  }

  // Assess compliance frameworks
  private assessCompliance(): ComplianceFramework[] {
    const frameworks: ComplianceFramework[] = [];

    // OWASP Top 10
    frameworks.push({
      id: 'owasp-top-10',
      name: 'OWASP Top 10',
      description: 'Web application security risks',
      requirements: [
        {
          id: 'broken-auth',
          title: 'Broken Authentication',
          description: 'Authentication and session management',
          status: this.nodes.some(n => (n.data as NodeData).config.type === 'auth') ? 'compliant' : 'non-compliant',
          remediation: ['Implement multi-factor authentication', 'Secure session management']
        },
        {
          id: 'sensitive-data',
          title: 'Sensitive Data Exposure',
          description: 'Protection of sensitive data',
          status: 'partial',
          remediation: ['Encrypt data at rest and in transit', 'Implement data classification']
        },
        {
          id: 'security-logging',
          title: 'Insufficient Logging & Monitoring',
          description: 'Security event detection and response',
          status: this.nodes.some(n => (n.data as NodeData).config.type === 'monitoring') ? 'compliant' : 'non-compliant',
          remediation: ['Implement comprehensive logging', 'Set up security monitoring']
        }
      ]
    });

    // SOC 2 Type II
    frameworks.push({
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Security, availability, processing integrity, confidentiality, and privacy',
      requirements: [
        {
          id: 'access-controls',
          title: 'Access Controls',
          description: 'Logical and physical access controls',
          status: this.nodes.some(n => (n.data as NodeData).config.type === 'auth') ? 'partial' : 'non-compliant',
          remediation: ['Implement role-based access control', 'Regular access reviews']
        },
        {
          id: 'encryption',
          title: 'Data Encryption',
          description: 'Encryption of data in transit and at rest',
          status: 'partial',
          remediation: ['Enable end-to-end encryption', 'Key management procedures']
        },
        {
          id: 'monitoring',
          title: 'System Monitoring',
          description: 'Continuous monitoring of security controls',
          status: this.nodes.some(n => (n.data as NodeData).config.type === 'monitoring') ? 'compliant' : 'non-compliant',
          remediation: ['Deploy SIEM solution', 'Automated alerting']
        }
      ]
    });

    return frameworks;
  }

  // Helper methods for security control assessment
  private assessAuthenticationControls(): number {
    let score = 0;
    const hasAuth = this.nodes.some(n => (n.data as NodeData).config.type === 'auth');
    if (hasAuth) score += 60;
    
    const authNodes = this.nodes.filter(n => (n.data as NodeData).config.type === 'auth');
    if (authNodes.some(n => (n.data as NodeData).config.replicas > 1)) score += 20;
    
    const hasGateway = this.nodes.some(n => (n.data as NodeData).config.type === 'gateway');
    if (hasGateway) score += 20;
    
    return score;
  }

  private assessAuthorizationControls(): number {
    let score = 30; // Base score
    const hasGateway = this.nodes.some(n => (n.data as NodeData).config.type === 'gateway');
    if (hasGateway) score += 40;
    
    const hasAuth = this.nodes.some(n => (n.data as NodeData).config.type === 'auth');
    if (hasAuth) score += 30;
    
    return score;
  }

  private assessEncryptionControls(): number {
    if (this.edges.length === 0) return 100;
    
    const encryptedEdges = this.edges.filter(e => 
      (e as any).type?.includes('encrypted') || (e as any).type?.includes('tls')
    );
    
    return Math.round((encryptedEdges.length / this.edges.length) * 100);
  }

  private assessMonitoringControls(): number {
    let score = 0;
    const hasMonitoring = this.nodes.some(n => (n.data as NodeData).config.type === 'monitoring');
    if (hasMonitoring) score += 70;
    
    const hasLogging = this.nodes.some(n => 
      (n.data as NodeData).config.name.toLowerCase().includes('log')
    );
    if (hasLogging) score += 30;
    
    return score;
  }

  private assessNetworkSecurityControls(): number {
    let score = 50; // Base score
    
    const hasGateway = this.nodes.some(n => (n.data as NodeData).config.type === 'gateway');
    if (hasGateway) score += 25;
    
    const externalServices = this.nodes.filter(n => (n.data as NodeData).config.type === 'external');
    if (externalServices.length === 0) score += 25;
    else if (externalServices.length <= 2) score += 10;
    
    return score;
  }
}

export { SecurityAnalyzer };