import type {
  DeskwootConfig,
  Conversation,
  ConversationFilters,
  BulkAction,
  Message,
  Contact,
  ContactFilters,
  Inbox,
  Label,
  Team,
  CannedResponse,
  Agent,
  AutomationRule,
  Webhook,
} from "./types";

export class Deskwoot {
  private apiToken: string;
  private accountId: string;
  private baseUrl: string;

  constructor(config: DeskwootConfig) {
    this.apiToken = config.apiToken;
    this.accountId = config.accountId;
    this.baseUrl = (config.baseUrl || "https://deskwoot.com").replace(/\/$/, "");
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new DeskwootError(res.status, error.error || res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  private get basePath() {
    return `/api/v1/accounts/${this.accountId}`;
  }

  // =========================================================================
  // Conversations
  // =========================================================================

  async listConversations(filters?: ConversationFilters): Promise<Conversation[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.assigneeId) params.set("assignee_id", filters.assigneeId);
    if (filters?.teamId) params.set("team_id", filters.teamId);
    if (filters?.inboxId) params.set("inbox_id", filters.inboxId);
    if (filters?.labelId) params.set("label_id", filters.labelId);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));
    const qs = params.toString();
    return this.request("GET", `${this.basePath}/conversations${qs ? `?${qs}` : ""}`);
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request("GET", `/api/v1/conversations/${conversationId}`);
  }

  async createConversation(data: {
    inboxId: string;
    contactId: string;
    message: string;
    status?: string;
    assigneeId?: string;
    teamId?: string;
  }): Promise<Conversation> {
    return this.request("POST", `${this.basePath}/conversations`, data);
  }

  async updateConversation(conversationId: string, data: {
    status?: string;
    priority?: string;
    assigneeId?: string | null;
    teamId?: string | null;
    muted?: boolean;
  }): Promise<Conversation> {
    return this.request("PATCH", `/api/v1/conversations/${conversationId}`, data);
  }

  async bulkConversationAction(action: BulkAction): Promise<void> {
    return this.request("POST", `${this.basePath}/conversations/bulk`, action);
  }

  // =========================================================================
  // Messages
  // =========================================================================

  async listMessages(conversationId: string): Promise<Message[]> {
    return this.request("GET", `/api/v1/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, data: {
    content: string;
    messageType?: "OUTGOING" | "INCOMING";
    contentType?: "TEXT" | "HTML";
    private?: boolean;
    cc?: string[];
    bcc?: string[];
  }): Promise<Message> {
    return this.request("POST", `/api/v1/conversations/${conversationId}/messages`, data);
  }

  // =========================================================================
  // Contacts
  // =========================================================================

  async listContacts(filters?: ContactFilters): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.segment) params.set("segment", filters.segment);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));
    const qs = params.toString();
    return this.request("GET", `${this.basePath}/contacts${qs ? `?${qs}` : ""}`);
  }

  async getContact(contactId: string): Promise<Contact> {
    return this.request("GET", `${this.basePath}/contacts/${contactId}`);
  }

  async createContact(data: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    location?: string;
    description?: string;
    customAttributes?: Record<string, unknown>;
  }): Promise<Contact> {
    return this.request("POST", `${this.basePath}/contacts`, data);
  }

  async updateContact(contactId: string, data: Partial<{
    name: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    description: string;
    customAttributes: Record<string, unknown>;
  }>): Promise<Contact> {
    return this.request("PATCH", `${this.basePath}/contacts/${contactId}`, data);
  }

  async deleteContact(contactId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/contacts/${contactId}`);
  }

  async mergeContacts(primaryId: string, secondaryId: string): Promise<Contact> {
    return this.request("POST", `${this.basePath}/contacts/merge`, {
      primaryContactId: primaryId,
      secondaryContactId: secondaryId,
    });
  }

  // =========================================================================
  // Inboxes
  // =========================================================================

  async listInboxes(): Promise<Inbox[]> {
    return this.request("GET", `${this.basePath}/inboxes`);
  }

  async getInbox(inboxId: string): Promise<Inbox> {
    return this.request("GET", `${this.basePath}/inboxes/${inboxId}`);
  }

  async createInbox(data: {
    name: string;
    channelType: string;
    emailAddress?: string;
  }): Promise<Inbox> {
    return this.request("POST", `${this.basePath}/inboxes`, data);
  }

  async updateInbox(inboxId: string, data: Partial<Inbox>): Promise<Inbox> {
    return this.request("PATCH", `${this.basePath}/inboxes/${inboxId}`, data);
  }

  async deleteInbox(inboxId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/inboxes/${inboxId}`);
  }

  // =========================================================================
  // Labels
  // =========================================================================

  async listLabels(): Promise<Label[]> {
    return this.request("GET", `${this.basePath}/labels`);
  }

  async createLabel(data: { title: string; color?: string; description?: string }): Promise<Label> {
    return this.request("POST", `${this.basePath}/labels`, data);
  }

  async updateLabel(labelId: string, data: Partial<Label>): Promise<Label> {
    return this.request("PATCH", `${this.basePath}/labels/${labelId}`, data);
  }

  async deleteLabel(labelId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/labels/${labelId}`);
  }

  async addLabelToConversation(conversationId: string, labelId: string): Promise<void> {
    return this.request("POST", `/api/v1/conversations/${conversationId}/labels`, { labelId });
  }

  async removeLabelFromConversation(conversationId: string, labelId: string): Promise<void> {
    return this.request("DELETE", `/api/v1/conversations/${conversationId}/labels`, { labelId });
  }

  // =========================================================================
  // Teams
  // =========================================================================

  async listTeams(): Promise<Team[]> {
    return this.request("GET", `${this.basePath}/teams`);
  }

  async createTeam(data: { name: string; description?: string; allowAutoAssign?: boolean }): Promise<Team> {
    return this.request("POST", `${this.basePath}/teams`, data);
  }

  async updateTeam(teamId: string, data: Partial<Team>): Promise<Team> {
    return this.request("PATCH", `${this.basePath}/teams/${teamId}`, data);
  }

  async deleteTeam(teamId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/teams/${teamId}`);
  }

  async addTeamMember(teamId: string, agentId: string): Promise<void> {
    return this.request("POST", `${this.basePath}/teams/${teamId}/members`, { agentId });
  }

  async removeTeamMember(teamId: string, agentId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/teams/${teamId}/members`, { agentId });
  }

  // =========================================================================
  // Agents
  // =========================================================================

  async listAgents(): Promise<Agent[]> {
    return this.request("GET", `${this.basePath}/agents`);
  }

  async inviteAgent(data: { email: string; role?: string }): Promise<Agent> {
    return this.request("POST", `${this.basePath}/agents`, data);
  }

  async updateAgent(agentId: string, data: { role?: string }): Promise<Agent> {
    return this.request("PATCH", `${this.basePath}/agents/${agentId}`, data);
  }

  async removeAgent(agentId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/agents/${agentId}`);
  }

  // =========================================================================
  // Canned Responses
  // =========================================================================

  async listCannedResponses(): Promise<CannedResponse[]> {
    return this.request("GET", `${this.basePath}/canned-responses`);
  }

  async createCannedResponse(data: { shortCode: string; content: string }): Promise<CannedResponse> {
    return this.request("POST", `${this.basePath}/canned-responses`, data);
  }

  async updateCannedResponse(id: string, data: Partial<CannedResponse>): Promise<CannedResponse> {
    return this.request("PATCH", `${this.basePath}/canned-responses/${id}`, data);
  }

  async deleteCannedResponse(id: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/canned-responses/${id}`);
  }

  // =========================================================================
  // Automation Rules
  // =========================================================================

  async listAutomationRules(): Promise<AutomationRule[]> {
    return this.request("GET", `${this.basePath}/automation-rules`);
  }

  async createAutomationRule(data: {
    name: string;
    eventName: string;
    conditions: unknown;
    actions: unknown;
  }): Promise<AutomationRule> {
    return this.request("POST", `${this.basePath}/automation-rules`, data);
  }

  async updateAutomationRule(ruleId: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    return this.request("PATCH", `${this.basePath}/automation-rules/${ruleId}`, data);
  }

  async deleteAutomationRule(ruleId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/automation-rules/${ruleId}`);
  }

  // =========================================================================
  // Webhooks
  // =========================================================================

  async listWebhooks(): Promise<Webhook[]> {
    return this.request("GET", `${this.basePath}/webhooks`);
  }

  async createWebhook(data: { url: string; events: string[] }): Promise<Webhook> {
    return this.request("POST", `${this.basePath}/webhooks`, data);
  }

  async updateWebhook(webhookId: string, data: Partial<Webhook>): Promise<Webhook> {
    return this.request("PATCH", `${this.basePath}/webhooks/${webhookId}`, data);
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request("DELETE", `${this.basePath}/webhooks/${webhookId}`);
  }
}

export class DeskwootError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "DeskwootError";
    this.status = status;
  }
}
