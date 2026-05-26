# Telegram Notification Management System

Complete documentation for the notification system implementation.

## System Architecture

### Components

1. **Firebase Backend**
   - `notifications/templates/` - Customizable message templates
   - `notifications/logs/{date}/{uid}` - Detailed send logs
   - `notifications/settings/` - Admin settings
   - `users/{uid}/timezone` - Per-user timezone
   - `users/{uid}/notificationsEnabled` - Per-user notification preference

2. **Backend API Endpoints**
   - `/api/daily-broadcast` - Sends notifications (Vercel cron at 9 AM UTC)
   - `/api/notifications-log` - Logs notification sends
   - `/api/admin-stats` - Get daily notification statistics
   - `/api/admin-send-test` - Send test notification
   - `/api/notification-templates` - Manage message templates

3. **Frontend**
   - Timezone detection on first login (Intl API)
   - Notification preferences in settings modal
   - Admin panel (Ctrl+Shift+A) with real-time statistics

## Features

### 1. Timezone Detection & Scheduling
- Automatically detects user's timezone on first login
- Stores timezone in Firebase (e.g., "America/New_York")
- Notifications send daily at 10:00 AM in user's local time
- Fallback to UTC if timezone detection fails
- Timezone selector in settings allows manual override

### 2. Message Templates
- Three default templates:
  - `dailyReminder` - Daily challenge reminder
  - `tournamentReminder` - Active tournament notification
  - `comebackReminder` - Win-back notification for inactive users
- Editable templates without redeploying backend
- Templates include: title, message, button text, enabled flag

### 3. Notification Logging
- Every notification send is logged with metadata:
  - User ID and Telegram ID
  - Message content
  - Template used
  - User's timezone
  - Send timestamp
  - Success/failure status
  - Error message (if failed)
- Logs stored at: `notifications/logs/{YYYY-MM-DD}/{uid}`

### 4. Duplicate Prevention
- Checks if notification already sent today
- Compares `lastNotificationTimestamp` with current date
- Prevents sending multiple notifications per day

### 5. Admin Debug Panel
- **Access:** Press `Ctrl+Shift+A` in the app
- **View:**
  - Today's send statistics (sent, failed, success rate)
  - Last sent message details
  - Recent logs (last 20 sends)
  - Template count and configuration
  - Last refresh timestamp

- **Actions:**
  - Send Test Notification - Send test to yourself
  - Refresh Stats - Update statistics
  - Retry Failed - Re-queue failed sends (WIP)

- **Template Editor:**
  - Edit template title, message, button text
  - Enable/disable templates
  - Preview changes
  - Save to Firebase

## Debug Console Logging

The system logs important events to the browser console with prefixes:

```
[Notification] Sending...        // When starting to send notification
[Notification] Success           // When notification sent successfully
[Notification] Failed            // When notification send failed
[Notification] Timezone detected // When user timezone is detected and saved
[Notification] Duplicate prevented // When duplicate notification is prevented
[DailyBroadcast] ...            // Backend broadcast details
[Admin] ...                      // Admin panel operations
[Settings] ...                   // Settings changes
[Templates] ...                  // Template operations
```

## Testing Checklist

### 1. Timezone Detection
```javascript
// In browser console (after login):
console.log('Current timezone:', currentUser.timezone);
console.log('Current hour in timezone:', getCurrentHourInTimezone(currentUser.timezone));
```

- [ ] Timezone detected on first login
- [ ] Timezone saved to Firebase in settings
- [ ] Correct timezone format (e.g., "America/New_York")
- [ ] Timezone selector in settings shows correct value
- [ ] Changing timezone saves to Firebase

### 2. Notification Settings
- [ ] "Enable Daily Notifications" checkbox works
- [ ] Disabled notifications prevent sending
- [ ] Setting persists in Firebase
- [ ] Toast message appears on change

### 3. Admin Panel Access
- [ ] Press Ctrl+Shift+A to open admin panel
- [ ] Admin panel shows statistics
- [ ] Stats display correct numbers
- [ ] Back button returns to home screen

### 4. Send Test Notification
- [ ] Click "Send Test" button in admin panel
- [ ] Notification arrives in Telegram within 5 seconds
- [ ] Log entry appears in recent logs
- [ ] Statistics update after send
- [ ] Failed sends show in admin panel

### 5. Templates
- [ ] Template editor shows all templates
- [ ] Can edit template fields
- [ ] Can toggle template enabled/disabled
- [ ] Save button persists changes to Firebase
- [ ] New templates used in subsequent sends

### 6. Daily Broadcast
```javascript
// Manually trigger daily-broadcast (for testing):
curl -X POST https://backend-url/api/daily-broadcast \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json"
```

- [ ] Notifications send at 10 AM in each user's timezone
- [ ] Logs are created with correct metadata
- [ ] Failed sends are tracked
- [ ] Duplicate prevention works (no 2x per day)
- [ ] Banned users don't receive notifications
- [ ] Users with notifications disabled don't receive notifications

### 7. Logging & Verification
- [ ] Browser console shows debug logs (filter by [Notification])
- [ ] Firebase logs are readable at: notifications/logs/{date}/
- [ ] Admin stats panel loads and updates
- [ ] Logs show: uid, telegramId, message, template, timezone, sentAt, success, errorMessage

## API Documentation

### GET /api/admin-stats
Returns notification statistics for today:
```json
{
  "ok": true,
  "stats": {
    "date": "2024-05-22",
    "sent": 10,
    "failed": 2,
    "total": 12,
    "successRate": 83.33,
    "lastSent": {...},
    "templateCount": 3,
    "recentLogs": [...]
  }
}
```

### POST /api/admin-send-test
Send test notification to a user:
```json
{
  "userId": "user123",
  "message": "Test message",
  "templateName": "test"
}
```

### POST /api/retry-failed
Re-queue failed notifications for a specific date:
```json
{
  "dateKey": "2024-05-22",
  "limit": 50,
  "retryAttempt": 1
}
```
Response:
```json
{
  "ok": true,
  "message": "Retry process complete",
  "dateKey": "2024-05-22",
  "retried": 45,
  "failed_count": 5,
  "total_retried": 50
}
```

### POST /api/notifications-log
Log a notification send:
```json
{
  "uid": "user123",
  "telegramId": "123456",
  "message": "Message content",
  "templateUsed": "dailyReminder",
  "timezone": "America/New_York",
  "sentAt": 1716412800000,
  "success": true,
  "errorMessage": ""
}
```

### GET /api/notification-templates
Fetch all templates:
```json
{
  "ok": true,
  "templates": {
    "dailyReminder": {...},
    "tournamentReminder": {...},
    "comebackReminder": {...}
  }
}
```

### PUT /api/notification-templates
Update a template:
```json
{
  "templateName": "dailyReminder",
  "template": {
    "enabled": true,
    "title": "New Title",
    "message": "New message",
    "buttonText": "New Button"
  }
}
```

### POST /api/send-to-all
Send notifications to all players (with automatic pagination):
```json
{
  "message": "Broadcast message"
}
```
Response:
```json
{
  "ok": true,
  "message": "Broadcast sent",
  "sent": 150,
  "failed": 5,
  "total": 1500
}
```

## Environment Variables

Required in Vercel/backend:
- `BOT_TOKEN` - Telegram bot token
- `FIREBASE_DATABASE_URL` - Firebase database URL
- `DAILY_BROADCAST_SECRET` - Secret for manual trigger
- `DAILY_TEMPLATE_NAME` - Template name to use (default: "dailyReminder")
- `DAILY_TELEGRAM_MESSAGE` - Fallback message if template fails
- `BACKEND_URL` - Backend URL for frontend API calls

## Firebase Rules

New paths protected:
```
notifications/templates/ - readable by all, server-managed only
notifications/logs/ - server-only, not accessible to clients
notifications/settings/ - server-only, admin settings
users/{uid}/timezone - user-editable, validated
users/{uid}/notificationsEnabled - user-editable
```

## Performance Considerations

1. **Rate Limiting**: Sends max 29 messages/second to stay under Telegram limits
2. **Batching**: Processes notifications in batches with 1-second delays between batches
3. **Timezone Calculations**: Uses Intl.DateTimeFormat for efficient timezone conversion
4. **Duplicate Prevention**: Compares date strings (faster than full timestamp check)
5. **Caching**: Profile cache expires after 1 minute

## Troubleshooting

### No notifications arriving
1. Check timezone is detected correctly
2. Verify current hour matches 10 AM in user's timezone
3. Check Firebase logs for failed sends
4. Ensure user has played at least 1 game
5. Verify notifications are enabled for user

### Wrong timezone
1. Check browser's system timezone
2. Verify Intl API works: `Intl.DateTimeFormat().resolvedOptions().timeZone`
3. Check Firebase for stored timezone
4. Try manually selecting timezone in settings

### Admin panel not loading
1. Press Ctrl+Shift+A again to toggle
2. Check browser console for errors
3. Verify BACKEND_URL is set correctly
4. Check admin endpoints are in vercel.json

### Templates not updating
1. Refresh admin panel (refresh stats button)
2. Check Firebase notifications/templates/ path
3. Verify template save returned success
4. Check browser console for save errors

## Future Enhancements

- [x] Retry failed sends mechanism
- [ ] User notification frequency preferences
- [ ] Rich media notifications (images, buttons)
- [ ] Notification scheduling (one-time, recurring)
- [ ] A/B testing different templates
- [ ] Advanced analytics (click-through rate, delivery time analysis)
- [ ] User segmentation (send different templates to different users)
- [ ] Notification history in user profile

## Security Notes

1. All logs are server-only (notifications/logs/ - no client read access)
2. Admin stats endpoint requires authentication (x-telegram-id header check) - ✓ Implemented
3. Template editing requires admin privileges (x-telegram-id header check) - ✓ Implemented
4. Telegram IDs are stored securely in Firebase
5. Notification preferences are user-editable
6. Failed sends are logged for debugging, not exposed to users
7. Retry-failed endpoint requires admin authentication - ✓ Implemented

## Files Modified/Created

### Backend
- `backend/api/daily-broadcast.js` - Updated with template loading and logging
- `backend/api/notifications-log.js` - New endpoint for logging
- `backend/api/admin-stats.js` - New endpoint for stats (with admin authentication)
- `backend/api/admin-send-test.js` - New endpoint for test sends (with admin authentication)
- `backend/api/notification-templates.js` - New endpoint for template management (with admin authentication)
- `backend/api/send-to-all.js` - Updated with pagination support for 1000+ users
- `backend/api/retry-failed.js` - New endpoint for re-queuing failed notifications (with admin authentication)
- `backend/vercel.json` - Updated routes

### Frontend
- `script.js` - Added timezone detection, admin panel, template editor
- `index.html` - Added admin panel screen
- `style.css` - Added admin panel and template editor styles

### Database
- `rules.json` - Added notification paths and rules
