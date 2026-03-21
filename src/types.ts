export interface DeskwootConfig {
  apiToken: string;
  accountId: string;
  baseUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total?: number;
}

// Conversations
export interface Conversation {
  id: string;
  displayId: number;
  accountId: string;
  inboxId: string;
  contactId: string;
  assigneeId?: string | null;
  teamId?: string | null;
  status: "OPEN" | "PENDING" | "RESOLVED" | "SNOOZED";
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW" | null;
  subject?: string | null;
  muted: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  contact?: Contact;
  messages?: Message[];
  labels?: Label[];
}

export interface ConversationFilters {
  status?: "OPEN" | "PENDING" | "RESOLVED" | "SNOOZED";
  assigneeId?: string;
  teamId?: string;
  inboxId?: string;
  labelId?: string;
  page?: number;
  pageSize?: number;
}

export interface BulkAction {
  action: "change_status" | "assign_agent" | "assign_team" | "change_priority" | "add_label" | "mute" | "unmute" | "mark_unread" | "snooze" | "delete";
  conversationIds: string[];
  value?: string;
}

// Messages
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  messageType: "INCOMING" | "OUTGOING" | "ACTIVITY";
  contentType: "TEXT" | "HTML";
  private: boolean;
  sourceId?: string | null;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  fileType: "IMAGE" | "AUDIO" | "VIDEO" | "FILE";
}

// Contacts
export interface Contact {
  id: string;
  accountId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  location?: string | null;
  description?: string | null;
  identifier?: string | null;
  customAttributes?: Record<string, unknown>;
  lastActivityAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  search?: string;
  segment?: string;
  page?: number;
  pageSize?: number;
}

// Inboxes
export interface Inbox {
  id: string;
  accountId: string;
  name: string;
  channelType: "EMAIL" | "WEBCHAT" | "TELEGRAM" | "WHATSAPP" | "FACEBOOK" | "INSTAGRAM" | "TWITTER" | "SMS" | "LINE";
  emailAddress?: string | null;
  enabled: boolean;
  greetingEnabled: boolean;
  greetingMessage?: string | null;
  createdAt: string;
}

// Labels
export interface Label {
  id: string;
  accountId: string;
  title: string;
  description?: string | null;
  color: string;
  createdAt: string;
}

// Teams
export interface Team {
  id: string;
  accountId: string;
  name: string;
  description?: string | null;
  allowAutoAssign: boolean;
  memberCount?: number;
  createdAt: string;
}

// Agents
export interface Agent {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  availability?: string | null;
  createdAt: string;
}

// Canned Responses
export interface CannedResponse {
  id: string;
  accountId: string;
  shortCode: string;
  content: string;
  createdAt: string;
}

// Automation Rules
export interface AutomationRule {
  id: string;
  accountId: string;
  name: string;
  description?: string | null;
  eventName: string;
  conditions: unknown;
  actions: unknown;
  active: boolean;
  createdAt: string;
}

// Webhooks
export interface Webhook {
  id: string;
  accountId: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}
