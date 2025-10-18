# Telegram Bot Setup Guide

## Overview

The Yorubacinemax Telegram Bot provides comprehensive movie management capabilities, including automated movie discovery, AI-powered recommendations, analytics, and administrative controls. This guide covers complete setup and configuration.

---

## Bot Features

### Core Capabilities
1. **Movie Management**
   - Add movies manually or via YouTube links
   - Edit movie metadata (title, description, genre, etc.)
   - Delete movies from the database
   - Inline search for quick movie lookup

2. **Automated Movie Discovery**
   - Autonomous movie finder (scheduled task)
   - Automatic YouTube channel monitoring
   - AI-powered metadata extraction
   - Duplicate detection

3. **Live TV Management**
   - Add/remove live TV sources
   - YouTube and HLS stream support
   - Queue management
   - Default source configuration

4. **Collections Management**
   - Create themed collections
   - Add/remove movies from collections
   - Edit collection metadata

5. **Analytics & Reporting**
   - User statistics
   - Viewing history
   - Popular movies tracking
   - Weekly digest reports

6. **AI Features**
   - Natural language movie search
   - Metadata correction and enhancement
   - Recommendations
   - Content analysis

---

## Prerequisites

1. **Telegram Account**
   - Active Telegram account
   - Access to create bots via BotFather

2. **Server Environment**
   - Node.js 22.x or higher
   - Running Yorubacinemax server
   - Internet connectivity

3. **API Keys** (Optional but recommended)
   - Google AI API key for AI features
   - Azure Storage for poster uploads (optional)

---

## Step 1: Create Telegram Bot

### 1.1 Open BotFather

1. Open Telegram app
2. Search for `@BotFather`
3. Start a conversation

### 1.2 Create New Bot

Send the following command:
```
/newbot
```

BotFather will ask for:

1. **Bot Name** (display name)
   - Example: `Yoruba Cinemax Manager`

2. **Bot Username** (must end in 'bot')
   - Example: `yorubacinemax_bot`

### 1.3 Save Bot Token

BotFather will provide a token like:
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**⚠️ Keep this token secure!** Anyone with this token can control your bot.

### 1.4 Configure Bot Settings

#### Enable Inline Mode
```
/setinline
```
Select your bot, then send:
```
Search movies...
```

#### Set Bot Description
```
/setdescription
```
Select your bot, then send:
```
Yoruba Cinemax Movie Manager - Add, edit, and manage Yoruba movies with AI assistance.
```

#### Set Bot Commands
```
/setcommands
```
Select your bot, then send:
```
start - Start the bot and show main menu
```

---

## Step 2: Get Your Telegram User ID

### Method 1: Using @userinfobot

1. Search for `@userinfobot` in Telegram
2. Start a conversation
3. Your user ID will be displayed (e.g., `123456789`)

### Method 2: Using @RawDataBot

1. Search for `@RawDataBot` in Telegram
2. Send any message
3. Look for `"id": 123456789` in the response

---

## Step 3: Configure Environment Variables

### Edit `.env` File

Add the following to `/home/ubuntu/Yorubacinemax.xyz/.env`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_TELEGRAM_USER_ID=123456789
```

Replace:
- `TELEGRAM_BOT_TOKEN` with your bot token from BotFather
- `ADMIN_TELEGRAM_USER_ID` with your Telegram user ID

### Complete `.env` Example

```env
# Session & Security
SESSION_ENCRYPTION_KEY=iKx6AYNaO44UTW7ZAgDKCELl2zm5xx0Yu4Mcft0iDJ0=
CSRF_SECRET=zhGEc5golW6PlhCgOkupQ9Sxmbsvy0LFrrcbE6QlMbQ=

# Google AI (Free Alternative)
GOOGLE_AI_API_KEY=AIzaSyC_your_actual_api_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_TELEGRAM_USER_ID=123456789

# Azure Storage (Optional - for poster uploads)
# AZURE_STORAGE_CONNECTION_STRING=your_connection_string
```

---

## Step 4: Start the Bot

### Development Mode

```bash
cd /home/ubuntu/Yorubacinemax.xyz
npm run dev
```

You should see:
```
✅ Telegram Bot is running!
🤖 Autonomous movie finder is disabled.
```

### Production Mode

```bash
npm run build
npm start
```

---

## Step 5: Test the Bot

### 5.1 Start Conversation

1. Open Telegram
2. Search for your bot username (e.g., `@yorubacinemax_bot`)
3. Click "Start" or send `/start`

### 5.2 Expected Response

You should see a welcome message with buttons:
- 🎬 Add Movie
- 📺 Manage Live TV
- 📊 View Analytics
- 🗂️ Collections
- ⚙️ Settings
- 🤖 AI Features

### 5.3 Test Features

#### Test Movie Search (Inline Mode)
1. In any Telegram chat, type: `@yorubacinemax_bot search query`
2. Results should appear inline

#### Test Adding a Movie
1. Click "🎬 Add Movie"
2. Choose "Add from YouTube"
3. Send a YouTube URL
4. Bot should fetch metadata and add the movie

---

## Bot Commands Reference

### Main Menu Commands

| Button | Function |
|--------|----------|
| 🎬 Add Movie | Add movies manually or from YouTube |
| 📺 Manage Live TV | Configure live TV sources |
| 📊 View Analytics | View statistics and reports |
| 🗂️ Collections | Manage movie collections |
| ⚙️ Settings | Configure bot automation |
| 🤖 AI Features | AI-powered recommendations |

### Movie Management

- **Add from YouTube:** Paste YouTube URL to auto-import
- **Add Manually:** Enter movie details step-by-step
- **Edit Movie:** Modify existing movie metadata
- **Delete Movie:** Remove movie from database

### Live TV Management

- **Add YouTube Source:** Add YouTube live stream
- **Add HLS Source:** Add HLS stream URL
- **Set Default Source:** Configure default stream
- **Remove Source:** Delete live TV source

### Automation Settings

- **Autonomous Finder:** Enable/disable automatic movie discovery
- **Check Interval:** Set how often to check for new movies
- **Target Channels:** Configure YouTube channels to monitor

---

## Autonomous Movie Finder

### Overview

The autonomous movie finder automatically discovers new Yoruba movies from YouTube channels and adds them to your database.

### Configuration

1. Click "⚙️ Settings" in the bot
2. Click "🤖 Autonomous Finder"
3. Click "✅ Enable" to activate
4. Set check interval (default: 60 minutes)

### How It Works

1. **Scheduled Checks:** Runs at configured intervals
2. **Channel Monitoring:** Searches YouTube for new Yoruba movies
3. **AI Analysis:** Uses AI to verify movie quality and relevance
4. **Duplicate Detection:** Prevents adding existing movies
5. **Automatic Addition:** Adds approved movies to database
6. **Notifications:** Sends Telegram notification for each new movie

### Recommended Settings

- **Check Interval:** 60-120 minutes
- **Target Channels:** Popular Yoruba movie channels
- **AI Verification:** Enabled (requires Google AI API key)

---

## Security Features

### Admin-Only Access

The bot is configured with admin-only access. Only the user ID specified in `ADMIN_TELEGRAM_USER_ID` can use the bot.

**Unauthorized users will receive:**
```
⛔ Sorry, you are not authorized to use this bot.
```

### Multi-Admin Setup (Optional)

To allow multiple admins, modify `/bot/run.ts`:

```typescript
const adminIds = ['123456789', '987654321']; // Add multiple IDs

const withAdminAuth = (handler: (msg: TelegramBot.Message) => void) => (msg: TelegramBot.Message) => {
    if (!adminIds.includes(msg.from?.id.toString() || '')) {
        bot.sendMessage(msg.chat.id, "⛔ Sorry, you are not authorized to use this bot.");
        return;
    }
    handler(msg);
};
```

---

## Troubleshooting

### Issue: "Bot is not responding"

**Possible Causes:**
1. Bot token is incorrect
2. Server is not running
3. Firewall blocking Telegram API

**Solutions:**
1. Verify `TELEGRAM_BOT_TOKEN` in `.env`
2. Check server logs for errors
3. Restart the server: `npm run dev`

### Issue: "Polling error: EFATAL"

**Cause:** Invalid characters in bot token

**Solution:**
1. Copy token again from BotFather
2. Ensure no extra spaces or newlines
3. Update `.env` file
4. Restart server

### Issue: "Not authorized" message

**Cause:** Your Telegram user ID doesn't match `ADMIN_TELEGRAM_USER_ID`

**Solution:**
1. Verify your user ID using @userinfobot
2. Update `ADMIN_TELEGRAM_USER_ID` in `.env`
3. Restart server

### Issue: "AI features not working"

**Cause:** Google AI API key not configured

**Solution:**
1. Get API key from https://aistudio.google.com/
2. Add `GOOGLE_AI_API_KEY` to `.env`
3. Restart server

### Issue: "Cannot upload posters"

**Cause:** Azure Storage not configured

**Solution:**
1. Posters will use YouTube thumbnails by default
2. To enable custom uploads, configure Azure Storage
3. Add `AZURE_STORAGE_CONNECTION_STRING` to `.env`

---

## Advanced Features

### Weekly Digest

The bot can send weekly analytics reports:

1. Click "📊 View Analytics"
2. Click "📧 Weekly Digest"
3. Receive comprehensive report with:
   - Total movies added
   - Most viewed movies
   - User engagement stats
   - Trending content

### Inline Movie Search

Use the bot in any Telegram chat:

```
@yorubacinemax_bot jagun jagun
```

Results appear inline for quick sharing.

### Batch Operations

Add multiple movies efficiently:

1. Enable autonomous finder
2. Configure target channels
3. Let the bot discover and add movies automatically

---

## Data Management

### Database Files

The bot uses JSON files for data storage:

- `/data/movies.json` - Movie database
- `/data/users.json` - User accounts
- `/data/liveTv.json` - Live TV sources
- `/data/collections.json` - Movie collections
- `/data/viewingHistory.json` - Watch history
- `/data/watchlists.json` - User watchlists

### Backup Recommendations

1. **Regular Backups:** Backup `/data/` directory daily
2. **Version Control:** Commit to git (exclude sensitive data)
3. **Cloud Backup:** Use cloud storage for redundancy

---

## Production Deployment

### Systemd Service (Linux)

Create `/etc/systemd/system/yorubacinemax.service`:

```ini
[Unit]
Description=Yoruba Cinemax Server with Telegram Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Yorubacinemax.xyz
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable yorubacinemax
sudo systemctl start yorubacinemax
sudo systemctl status yorubacinemax
```

### Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5019

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t yorubacinemax .
docker run -d -p 5019:5019 --env-file .env yorubacinemax
```

---

## Best Practices

### 1. Security
- Never commit `.env` file to git
- Rotate bot token periodically
- Limit admin access to trusted users
- Use environment variables for secrets

### 2. Performance
- Enable autonomous finder during off-peak hours
- Set reasonable check intervals (60+ minutes)
- Monitor server resources

### 3. Maintenance
- Regular database backups
- Update dependencies monthly
- Monitor bot logs for errors
- Test features after updates

### 4. User Experience
- Keep bot responses concise
- Use emojis for visual clarity
- Provide clear error messages
- Test all features regularly

---

## Support & Resources

### Official Documentation
- Telegram Bot API: https://core.telegram.org/bots/api
- BotFather Guide: https://core.telegram.org/bots#botfather
- Node Telegram Bot API: https://github.com/yagop/node-telegram-bot-api

### Community Support
- Telegram Bot Developers: https://t.me/BotDevelopment
- Stack Overflow: Tag `telegram-bot`

---

## Conclusion

The Yorubacinemax Telegram Bot provides powerful movie management capabilities with AI assistance and automation. With proper configuration, it can significantly streamline content management and provide valuable analytics.

Follow this guide to set up and configure the bot for your deployment. For additional assistance, refer to the codebase documentation or community resources.

---

**Last Updated:** October 18, 2025  
**Status:** ✅ Production Ready  
**Estimated Setup Time:** 10-15 minutes

