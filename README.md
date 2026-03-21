# deskwoot-js

Official JavaScript/TypeScript client for the [Deskwoot](https://deskwoot.com) API.

## Install

```bash
npm install deskwoot
```

## Quick Start

```typescript
import { Deskwoot } from "deskwoot";

const client = new Deskwoot({
  apiToken: "your-api-token",
  accountId: "your-account-id",
});

// List open conversations
const conversations = await client.listConversations({ status: "OPEN" });

// Send a message
await client.sendMessage(conversations[0].id, {
  content: "Thanks for reaching out! We'll look into this.",
});

// Create a contact
const contact = await client.createContact({
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme Inc",
});
```

## API Coverage

| Resource | Methods |
|----------|---------|
| Conversations | list, get, create, update, bulk actions |
| Messages | list, send (text/html, private notes, cc/bcc) |
| Contacts | list, get, create, update, delete, merge |
| Inboxes | list, get, create, update, delete |
| Labels | list, create, update, delete, add/remove from conversations |
| Teams | list, create, update, delete, add/remove members |
| Agents | list, invite, update, remove |
| Canned Responses | list, create, update, delete |
| Automation Rules | list, create, update, delete |
| Webhooks | list, create, update, delete |

## Authentication

Generate an API token in your Deskwoot dashboard under **Settings > API Tokens**.

```typescript
const client = new Deskwoot({
  apiToken: "your-api-token",
  accountId: "your-account-id",
  baseUrl: "https://deskwoot.com", // optional, defaults to https://deskwoot.com
});
```

## Error Handling

```typescript
import { Deskwoot, DeskwootError } from "deskwoot";

try {
  await client.getConversation("invalid-id");
} catch (err) {
  if (err instanceof DeskwootError) {
    console.log(err.status); // 404
    console.log(err.message); // "Not found"
  }
}
```

## Examples

### List conversations by inbox

```typescript
const conversations = await client.listConversations({
  inboxId: "inbox-id",
  status: "OPEN",
  page: 1,
  pageSize: 25,
});
```

### Resolve a conversation

```typescript
await client.updateConversation("conversation-id", {
  status: "RESOLVED",
});
```

### Bulk assign conversations

```typescript
await client.bulkConversationAction({
  action: "assign_agent",
  conversationIds: ["conv-1", "conv-2", "conv-3"],
  value: "agent-id",
});
```

### Search contacts

```typescript
const contacts = await client.listContacts({
  search: "jane@example.com",
});
```

### Create a webhook

```typescript
await client.createWebhook({
  url: "https://your-app.com/webhooks/deskwoot",
  events: ["conversation.created", "message.created"],
});
```

## License

MIT
