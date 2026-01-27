# TallyDaili - Installation Guide

## 📱 For WhatsApp Sharing

### What's in the ZIP file:
The `TallyDaili-App.zip` contains the complete built app that works offline.

### How to use it:

#### Option 1: Simple File Sharing (Recommended for WhatsApp)
1. **Send the ZIP**: Share `TallyDaili-App.zip` via WhatsApp
2. **Extract on Phone**: Download and extract the ZIP file on your phone
3. **Open index.html**: Use any file manager app to open the `index.html` file
4. **Bookmark it**: Add the opened page to your browser bookmarks for quick access

**Note**: This method works but the app won't have the "Install" button since it's opened as a local file.

#### Option 2: Use a Free Hosting Service (Best Experience)
For the full PWA experience with "Install App" button:

1. **Upload to Netlify** (Free, 2 minutes):
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the extracted `dist` folder
   - Get instant URL like `tallydaili-xyz.netlify.app`
   - Share this URL via WhatsApp

2. **On Mobile**:
   - Open the Netlify URL in Chrome/Safari
   - Tap the menu (⋮) or Share button
   - Select "Add to Home Screen" or "Install App"

## 🔧 Why "Install" isn't showing on local network

The PWA "Install" prompt requires:
- **HTTPS** (secure connection) OR
- **localhost** (which works on your computer but not on phone via IP)

When you access via `http://192.168.1.15:5173`, the browser sees it as an insecure connection and blocks the install feature.

### Solutions:
1. **Use Netlify/Vercel** (recommended) - gives you HTTPS for free
2. **Use ngrok** to create a secure tunnel:
   ```bash
   npx ngrok http 5173
   ```
   This gives you a temporary HTTPS URL you can use on your phone

## 📦 What's Included
- Complete offline-capable app
- All assets and icons
- PWA manifest
- Local database (Dexie.js)

---

*For best results, use Netlify Drop - it's free, instant, and gives you the full PWA experience!*
