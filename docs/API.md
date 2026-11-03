# Deskwoot REST API Reference

Full documentation: [deskwoot.com/docs/api](https://deskwoot.com/docs/api)

## Base URL

```
https://api.deskwoot.com/v1
```

## Authentication

Bearer token authentication. Generate tokens in **Settings > API Tokens** (Enterprise plan).

```
Authorization: Bearer dw_your_api_token_here
```

### Scopes

| Scope | Description |
|-------|-------------|
| `read` | Read access to all resources |
| `write` | Write access to all resources |
| `contacts:read` | Read contacts only |
| `contacts:write` | Create/update/delete contacts |
| `conversations:read` | Read conversations and messages |
| `conversations:write` | Create/update conversations and messages |

## Rate Limits

60 requests per minute per token. `429` response when exceeded.

---

## Conversations

### List conversations

```
GET /v1/accounts/{accountId}/conversations
```

Query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `OPEN`, `PENDING`, `RESOLVED`, `SNOOZED` |
| `assignee_id` | string | Filter by assigned agent |
| `team_id` | string | Filter by team |
| `inbox_id` | string | Filter by inbox |
| `label_id` | string | Filter by label |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (max: 100) |

### Get conversation

```
GET /v1/conversations/{conversationId}
```

### Create conversation

```
POST /v1/accounts/{accountId}/conversations
```

```json
{
  "inboxId": "inbox-id",
  "contactId": "contact-id",
  "message": "Initial message content",
  "status": "OPEN",
  "assigneeId": "agent-id",
  "teamId": "team-id"
}
```

### Update conversation

```
PATCH /v1/conversations/{conversationId}
```

```json
{
  "status": "RESOLVED",
  "priority": "HIGH",
  "assigneeId": "agent-id",
  "teamId": "team-id",
  "muted": false
}
```

### Bulk actions

```
POST /v1/accounts/{accountId}/conversations/bulk
```

```json
{
  "action": "change_status",
  "conversationIds": ["conv-1", "conv-2"],
  "value": "RESOLVED"
}
```

Actions: `change_status`, `assign_agent`, `assign_team`, `change_priority`, `add_label`, `mute`, `unmute`, `mark_unread`, `snooze`, `delete`

---

## Messages

### List messages

```
GET /v1/conversations/{conversationId}/messages
```

### Send message

```
POST /v1/conversations/{conversationId}/messages
```

```json
{
  "content": "Your message here",
  "messageType": "OUTGOING",
  "contentType": "TEXT",
  "private": false,
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

### Upload attachment

```
POST /v1/conversations/{conversationId}/attachments
```

Multipart form data. Max 10MB. Supported: images, videos, audio, documents.

### Manage labels

```
POST /v1/conversations/{conversationId}/labels
DELETE /v1/conversations/{conversationId}/labels
```

```json
{ "labelId": "label-id" }
```

---

## Contacts

### List contacts

```
GET /v1/accounts/{accountId}/contacts
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name, email, phone |
| `segment` | string | `active-7d`, `active-30d`, `no-email`, `has-email`, `has-phone`, `new` |
| `page` | number | Page number |
| `pageSize` | number | Items per page |

### Create contact

```
POST /v1/accounts/{accountId}/contacts
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "location": "New York",
  "customAttributes": { "plan": "enterprise" }
}
```

### Update contact

```
PATCH /v1/accounts/{accountId}/contacts/{contactId}
```

### Delete contact

```
DELETE /v1/accounts/{accountId}/contacts/{contactId}
```

### Merge contacts

```
POST /v1/accounts/{accountId}/contacts/merge
```

```json
{
  "primaryContactId": "keep-this-id",
  "secondaryContactId": "merge-into-primary"
}
```

---

## Inboxes

### List inboxes

```
GET /v1/accounts/{accountId}/inboxes
```

### Create inbox

```
POST /v1/accounts/{accountId}/inboxes
```

```json
{
  "name": "Support Email",
  "channelType": "EMAIL",
  "emailAddress": "support@example.com"
}
```

Channel types: `EMAIL`, `WEBCHAT`, `TELEGRAM`, `WHATSAPP`, `FACEBOOK`, `INSTAGRAM`, `TWITTER`, `SMS`, `LINE`

### Update / Delete inbox

```
PATCH /v1/accounts/{accountId}/inboxes/{inboxId}
DELETE /v1/accounts/{accountId}/inboxes/{inboxId}
```

---

## Labels

```
GET    /v1/accounts/{accountId}/labels
POST   /v1/accounts/{accountId}/labels
PATCH  /v1/accounts/{accountId}/labels/{labelId}
DELETE /v1/accounts/{accountId}/labels/{labelId}
```

```json
{
  "title": "VIP",
  "color": "#FF5733",
  "description": "High-priority customers"
}
```

---

## Teams

```
GET    /v1/accounts/{accountId}/teams
POST   /v1/accounts/{accountId}/teams
PATCH  /v1/accounts/{accountId}/teams/{teamId}
DELETE /v1/accounts/{accountId}/teams/{teamId}
```

### Manage members

```
POST   /v1/accounts/{accountId}/teams/{teamId}/members   { "agentId": "..." }
DELETE /v1/accounts/{accountId}/teams/{teamId}/members   { "agentId": "..." }
```

---

## Agents

```
GET    /v1/accounts/{accountId}/agents
POST   /v1/accounts/{accountId}/agents                   { "email": "...", "role": "agent" }
PATCH  /v1/accounts/{accountId}/agents/{agentId}          { "role": "admin" }
DELETE /v1/accounts/{accountId}/agents/{agentId}
```

---

## Canned Responses

```
GET    /v1/accounts/{accountId}/canned-responses
POST   /v1/accounts/{accountId}/canned-responses          { "shortCode": "thanks", "content": "Thank you!" }
PATCH  /v1/accounts/{accountId}/canned-responses/{id}
DELETE /v1/accounts/{accountId}/canned-responses/{id}
```

---

## Automation Rules

```
GET    /v1/accounts/{accountId}/automation-rules
POST   /v1/accounts/{accountId}/automation-rules
PATCH  /v1/accounts/{accountId}/automation-rules/{ruleId}
DELETE /v1/accounts/{accountId}/automation-rules/{ruleId}
```

```json
{
  "name": "Auto-assign billing tickets",
  "eventName": "CONVERSATION_CREATED",
  "conditions": { "subject": { "contains": "billing" } },
  "actions": [{ "type": "assign_team", "value": "billing-team-id" }]
}
```

---

## Webhooks

```
GET    /v1/accounts/{accountId}/webhooks
POST   /v1/accounts/{accountId}/webhooks
PATCH  /v1/accounts/{accountId}/webhooks/{webhookId}
DELETE /v1/accounts/{accountId}/webhooks/{webhookId}
```

```json
{
  "url": "https://your-app.com/webhooks",
  "events": ["message.created", "conversation.created", "conversation.updated", "contact.created", "contact.updated"]
}
```

Webhook payloads include `X-Deskwoot-Signature` header (HMAC-SHA256).

---

## Bots & AI

```
GET    /v1/accounts/{accountId}/bots
POST   /v1/accounts/{accountId}/bots
PATCH  /v1/accounts/{accountId}/bots/{botId}
DELETE /v1/accounts/{accountId}/bots/{botId}
POST   /v1/accounts/{accountId}/bots/test
```

### Training Sources

```
GET    /v1/accounts/{accountId}/training-sources
POST   /v1/accounts/{accountId}/training-sources
PATCH  /v1/accounts/{accountId}/training-sources/{sourceId}
DELETE /v1/accounts/{accountId}/training-sources/{sourceId}
```

---

## Help Center (Public)

No authentication required:

```
GET /v1/public/portals/{portalSlug}
GET /v1/public/portals/{portalSlug}/articles
GET /v1/public/portals/{portalSlug}/articles/{articleSlug}
```

---

## Account

```
GET   /v1/accounts/{accountId}/settings
PATCH /v1/accounts/{accountId}/settings
GET   /v1/accounts/{accountId}/billing
GET   /v1/accounts/{accountId}/audit-logs
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Resource created |
| `204` | Deleted |
| `400` | Invalid parameters |
| `401` | Missing or invalid token |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Duplicate resource |
| `429` | Rate limit exceeded |
| `500` | Server error |

---

## Support

- Email: hello@deskwoot.com
- Live Chat: [deskwoot.com](https://deskwoot.com)
- Docs: [deskwoot.com/docs/api](https://deskwoot.com/docs/api)
