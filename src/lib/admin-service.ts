// Admin service functions for pilot management
import { 
  PilotRequest, 
  AuditEntry, 
  SLA, 
  CallLog, 
  ArtifactRequest, 
  BulkAction, 
  CaseFileExport, 
  MetricsSnapshot,
  ConsentRecord,
  RubricScores,
  EMAIL_TEMPLATES
} from '@/types/admin';

export class AdminService {
  
  // ============ Intake & Triage ============
  
  static async assignReviewer(requestId: string, userId: string): Promise<void> {
    const slaTimer = new Date();
    slaTimer.setHours(slaTimer.getHours() + 48); // 48h SLA
    
    await Promise.all([
      this.updateRequest(requestId, { 
        ownerUserId: userId,
        updatedAt: new Date()
      }),
      this.setSLA(requestId, {
        dueAt: slaTimer,
        kind: 'INITIAL_CONTACT'
      }),
      this.sendEmail(EMAIL_TEMPLATES.INVITE, [userId], {
        requestId,
        slaDeadline: slaTimer.toISOString()
      }),
      this.appendAuditLog(requestId, 'REVIEWER_ASSIGNED', userId, { reviewerId: userId })
    ]);
  }

  static async tagRequest(requestId: string, tags: string[]): Promise<void> {
    await this.updateRequest(requestId, { 
      tags,
      updatedAt: new Date()
    });
    
    await this.appendAuditLog(requestId, 'TAGS_UPDATED', 'system', { tags });
  }

  static async scoreFit(requestId: string, rubricScores: RubricScores): Promise<void> {
    await this.updateRequest(requestId, {
      score: {
        fit: rubricScores.missionFit.score,
        feasibility: rubricScores.dataFeasibility.score,
        timeline: rubricScores.timeline.score,
        notes: `Mission: ${rubricScores.missionFit.notes}; Role: ${rubricScores.roleClarity.notes}; Data: ${rubricScores.dataFeasibility.notes}; Timeline: ${rubricScores.timeline.notes}`
      },
      updatedAt: new Date()
    });

    await this.appendAuditLog(requestId, 'RUBRIC_SCORED', 'system', { 
      scores: rubricScores,
      recommendation: rubricScores.recommendation
    });
  }

  static async deduplicate(requestId: string, mergeIntoId: string): Promise<void> {
    // Merge request data and create merge log
    const originalRequest = await this.getRequest(requestId);
    const targetRequest = await this.getRequest(mergeIntoId);
    
    await this.appendAuditLog(mergeIntoId, 'REQUEST_MERGED', 'system', {
      mergedRequestId: requestId,
      mergedData: originalRequest
    });
    
    await this.appendAuditLog(requestId, 'MERGED_INTO', 'system', {
      targetRequestId: mergeIntoId
    });
    
    // Mark original as merged
    await this.updateRequest(requestId, {
      status: 'CONVERTED', // Reusing status to indicate merged
      updatedAt: new Date()
    });
  }

  // ============ Legal & Approvals ============
  
  static async generateAgreementLink(requestId: string): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry
    
    const agreementLink = {
      token,
      expiresAt,
    };
    
    await this.updateRequest(requestId, {
      agreementLink,
      status: 'AGREEMENT_OUT',
      updatedAt: new Date()
    });
    
    await this.appendAuditLog(requestId, 'AGREEMENT_LINK_GENERATED', 'system', {
      token: token.substring(0, 8) + '...', // Log partial token for audit
      expiresAt
    });
    
    return `${process.env.NEXT_PUBLIC_BASE_URL}/pilot-agreement?token=${token}`;
  }

  static async recordSignature(requestId: string, signer: string, ipAddress: string): Promise<void> {
    const ipHash = await this.hashIP(ipAddress);
    const signatureTime = new Date();
    
    await this.updateRequest(requestId, {
      'agreementLink.usedAt': signatureTime,
      status: 'SIGNED',
      updatedAt: new Date()
    });
    
    await this.appendAuditLog(requestId, 'AGREEMENT_SIGNED', signer, {
      signatureTime,
      ipHash
    });
  }

  static async recordConsent(requestId: string, consentType: ConsentRecord['consentType'], scope: string): Promise<void> {
    const consent: ConsentRecord = {
      requestId,
      consentType,
      scope,
      grantedAt: new Date(),
      grantedBy: 'applicant' // Could be dynamic based on context
    };
    
    // Store consent record
    await this.storeConsent(consent);
    
    await this.appendAuditLog(requestId, 'CONSENT_RECORDED', 'applicant', {
      consentType,
      scope
    });
  }

  // ============ Scoping → Pilot Creation ============
  
  static async createPilotWorkspace(requestId: string): Promise<string> {
    const request = await this.getRequest(requestId);
    const pilotId = this.generateId();
    
    const pilot = {
      id: pilotId,
      orgId: request.org,
      name: `${request.org} Pilot Program`,
      status: 'ONBOARDING',
      metricsTargets: {
        storageDelta: 0.15, // 15% improvement target
        p95VerifyMs: 500, // 500ms target
        auditEffortDelta: 0.30 // 30% effort reduction
      },
      createdFromRequestId: requestId,
      createdAt: new Date(),
      audit: {
        entries: [],
        headHash: ''
      }
    };
    
    await Promise.all([
      this.createPilot(pilot),
      this.assignPilotRole(pilotId, request.email, request.roleHint),
      this.planMilestones(pilotId),
      this.updateRequest(requestId, { status: 'CONVERTED' })
    ]);
    
    await this.appendAuditLog(requestId, 'PILOT_CREATED', 'system', { pilotId });
    
    return pilotId;
  }

  static async assignPilotRole(pilotId: string, userId: string, role: string): Promise<void> {
    await this.createParticipant(pilotId, {
      userId,
      role,
      consent: {
        caseStudy: false,
        metricsShare: false
      },
      joinedAt: new Date()
    });
    
    await this.appendAuditLog(pilotId, 'ROLE_ASSIGNED', 'system', { userId, role });
  }

  static async setSuccessMetrics(pilotId: string, metrics: any): Promise<void> {
    await this.updatePilot(pilotId, {
      metricsTargets: metrics,
      updatedAt: new Date()
    });
    
    await this.appendAuditLog(pilotId, 'METRICS_SET', 'system', { metrics });
  }

  static async planMilestones(pilotId: string): Promise<void> {
    const template = await this.getMilestoneTemplate();
    const startDate = new Date();
    
    const milestones = template.map((milestone: any, index: number) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (index + 1) * 14); // 2 week intervals
      
      return {
        ...milestone,
        pilotId,
        dueAt: dueDate,
        status: 'PENDING'
      };
    });
    
    await this.createMilestones(pilotId, milestones);
    await this.appendAuditLog(pilotId, 'MILESTONES_PLANNED', 'system', { count: milestones.length });
  }

  // ============ Communication & Scheduling ============
  
  static async sendEmail(templateId: string, to: string[], vars: Record<string, any>): Promise<void> {
    const template = await this.getEmailTemplate(templateId);
    
    // Implementation would integrate with SendGrid or similar
    console.log(`Sending ${templateId} to ${to.join(', ')} with vars:`, vars);
    
    // Log email send
    await this.appendAuditLog(vars.requestId || vars.pilotId, 'EMAIL_SENT', 'system', {
      templateId,
      recipients: to.length,
      subject: template.subject
    });
  }

  static async logCall(pilotId: string, callData: Omit<CallLog, 'id' | 'pilotId' | 'createdBy'>): Promise<void> {
    const callLog: CallLog = {
      id: this.generateId(),
      pilotId,
      ...callData,
      createdBy: 'current_user' // Would be dynamic
    };
    
    await this.storeCallLog(callLog);
    await this.appendAuditLog(pilotId, 'CALL_LOGGED', callLog.createdBy, {
      attendeeCount: callLog.attendees.length,
      decisionCount: callLog.decisions.length
    });
  }

  static async requestArtifact(pilotId: string, deliverableId: string, message: string): Promise<void> {
    const uploadUrl = await this.generateSignedUploadUrl(pilotId, deliverableId);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 day due date
    
    const request: ArtifactRequest = {
      id: this.generateId(),
      pilotId,
      deliverableId,
      message,
      requestedBy: 'current_user',
      requestedAt: new Date(),
      dueAt: dueDate,
      uploadUrl,
      status: 'PENDING'
    };
    
    await this.storeArtifactRequest(request);
    await this.appendAuditLog(pilotId, 'ARTIFACT_REQUESTED', request.requestedBy, {
      deliverableId,
      dueAt: dueDate
    });
  }

  // ============ Status & SLA Automation ============
  
  static async advanceStatus(entityId: string, nextStatus: string, reason: string): Promise<void> {
    await this.updateEntityStatus(entityId, nextStatus);
    await this.appendAuditLog(entityId, 'STATUS_ADVANCED', 'current_user', {
      newStatus: nextStatus,
      reason
    });
  }

  static async setSLA(entityId: string, sla: { dueAt: Date; kind: string }): Promise<void> {
    await this.storeSLA({
      entityId,
      ...sla,
      isOverdue: false,
      escalationLevel: 0
    });
  }

  static async autoNudgeOnOverdue(): Promise<void> {
    const overdueSLAs = await this.getOverdueSLAs();
    
    for (const sla of overdueSLAs) {
      await this.sendNudgeEmail(sla);
      await this.escalateSLA(sla);
    }
  }

  // ============ Evidence & Auditability ============
  
  static async appendAuditLog(entityId: string, action: string, actor: string, metadata: Record<string, any>): Promise<void> {
    const prevEntry = await this.getLastAuditEntry(entityId);
    const entry: AuditEntry = {
      id: this.generateId(),
      action,
      actor,
      metadata,
      timestamp: new Date(),
      prevHash: prevEntry?.currHash,
      currHash: await this.calculateHash(entityId, action, actor, metadata, prevEntry?.currHash)
    };
    
    await this.storeAuditEntry(entityId, entry);
  }

  static async exportCaseFile(pilotId: string, format: 'pdf' | 'zip'): Promise<string> {
    const caseData = await this.gatherCaseFileData(pilotId);
    
    if (format === 'pdf') {
      return await this.generatePDFCaseFile(caseData);
    } else {
      return await this.generateZipCaseFile(caseData);
    }
  }

  static async snapshotMetrics(pilotId: string): Promise<void> {
    const metrics = await this.calculateCurrentMetrics(pilotId);
    
    const snapshot: MetricsSnapshot = {
      id: this.generateId(),
      pilotId,
      capturedAt: new Date(),
      ...metrics
    };
    
    await this.storeMetricsSnapshot(snapshot);
    await this.appendAuditLog(pilotId, 'METRICS_SNAPSHOT', 'system', snapshot);
  }

  // ============ Safety & Access ============
  
  static async revokeAccess(pilotId: string, userId: string): Promise<void> {
    await Promise.all([
      this.removeParticipant(pilotId, userId),
      this.revokeUserTokens(userId),
      this.appendAuditLog(pilotId, 'ACCESS_REVOKED', 'admin', { userId })
    ]);
  }

  static async gdprDelete(subjectEmail: string): Promise<void> {
    await Promise.all([
      this.redactPIIFromRequests(subjectEmail),
      this.redactPIIFromPilots(subjectEmail),
      this.redactPIIFromLogs(subjectEmail)
    ]);
    
    // Create audit marker for deletion
    await this.appendAuditLog('system', 'GDPR_DELETION', 'admin', {
      subjectEmailHash: await this.hashEmail(subjectEmail),
      deletedAt: new Date()
    });
  }

  // ============ Helper Methods ============
  
  private static generateSecureToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private static async hashIP(ip: string): Promise<string> {
    // Implementation would use crypto.subtle.digest
    return `hash_${ip.split('.').map(() => 'x').join('.')}`;
  }

  private static async hashEmail(email: string): Promise<string> {
    // Implementation would use crypto.subtle.digest
    return `hash_${email.split('@')[0].substring(0, 3)}@${email.split('@')[1]}`;
  }

  private static async calculateHash(entityId: string, action: string, actor: string, metadata: any, prevHash?: string): Promise<string> {
    const data = JSON.stringify({ entityId, action, actor, metadata, prevHash, timestamp: Date.now() });
    // Implementation would use crypto.subtle.digest
    return `hash_${data.length}_${Math.random().toString(36).substring(2)}`;
  }

  // Placeholder methods for data operations (would integrate with Firestore)
  private static async updateRequest(id: string, data: any): Promise<void> { /* Firestore update */ }
  private static async getRequest(id: string): Promise<any> { /* Firestore get */ return {}; }
  private static async createPilot(pilot: any): Promise<void> { /* Firestore create */ }
  private static async updatePilot(id: string, data: any): Promise<void> { /* Firestore update */ }
  private static async createParticipant(pilotId: string, participant: any): Promise<void> { /* Firestore create */ }
  private static async createMilestones(pilotId: string, milestones: any[]): Promise<void> { /* Firestore batch create */ }
  private static async getMilestoneTemplate(): Promise<any[]> { return []; }
  private static async getEmailTemplate(id: string): Promise<any> { return {}; }
  private static async storeCallLog(log: CallLog): Promise<void> { /* Firestore create */ }
  private static async storeArtifactRequest(request: ArtifactRequest): Promise<void> { /* Firestore create */ }
  private static async storeConsent(consent: ConsentRecord): Promise<void> { /* Firestore create */ }
  private static async storeSLA(sla: SLA): Promise<void> { /* Firestore create */ }
  private static async storeAuditEntry(entityId: string, entry: AuditEntry): Promise<void> { /* Firestore create */ }
  private static async storeMetricsSnapshot(snapshot: MetricsSnapshot): Promise<void> { /* Firestore create */ }
  private static async getLastAuditEntry(entityId: string): Promise<AuditEntry | null> { return null; }
  private static async getOverdueSLAs(): Promise<SLA[]> { return []; }
  private static async updateEntityStatus(entityId: string, status: string): Promise<void> { /* Firestore update */ }
  private static async generateSignedUploadUrl(pilotId: string, deliverableId: string): Promise<string> { return ''; }
  private static async sendNudgeEmail(sla: SLA): Promise<void> { /* Email service */ }
  private static async escalateSLA(sla: SLA): Promise<void> { /* Update escalation level */ }
  private static async gatherCaseFileData(pilotId: string): Promise<any> { return {}; }
  private static async generatePDFCaseFile(data: any): Promise<string> { return ''; }
  private static async generateZipCaseFile(data: any): Promise<string> { return ''; }
  private static async calculateCurrentMetrics(pilotId: string): Promise<any> { return {}; }
  private static async removeParticipant(pilotId: string, userId: string): Promise<void> { /* Firestore delete */ }
  private static async revokeUserTokens(userId: string): Promise<void> { /* Auth service */ }
  private static async redactPIIFromRequests(email: string): Promise<void> { /* Data redaction */ }
  private static async redactPIIFromPilots(email: string): Promise<void> { /* Data redaction */ }
  private static async redactPIIFromLogs(email: string): Promise<void> { /* Data redaction */ }
}
