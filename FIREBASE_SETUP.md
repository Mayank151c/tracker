# Firebase Setup Guide (FREE)

Follow these simple steps to get your Firebase configuration - completely FREE!

## Step 1: Create Firebase Account

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with your Google account (or create one)
3. Click **"Get Started"** or **"Add project"**

## Step 2: Create a Firebase Project

1. Enter a project name (e.g., "tracker-app")
2. Click **"Continue"**
3. (Optional) Enable Google Analytics - you can skip this by clicking "Not now"
4. Click **"Create project"**
5. Wait a few seconds for the project to be created
6. Click **"Continue"**

## Step 3: Enable Firestore Database

1. In your Firebase Console, look at the left sidebar
2. Click **"Build"** → **"Firestore Database"**
3. Click **"Create database"**
4. Choose **"Start in test mode"** (for development - FREE)
5. Click **"Next"**
6. Select a location (choose the closest to you)
7. Click **"Enable"**

**Important**: Test mode allows read/write for 30 days, then you'll need to set up security rules. For now, this is perfect for testing!

## Step 4: Get Your Firebase Config

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to the section **"Your apps"**
4. Click the **Web icon** `</>` (or "Add app" → "Web")
5. Register your app:
   - Enter an app nickname (e.g., "tracker-web")
   - (Optional) Check "Also set up Firebase Hosting"
   - Click **"Register app"**
6. You'll see your Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

7. **COPY THESE VALUES** - You'll need them for your React app!

## Step 5: Use in Your React App

1. Run your React app: `npm start`
2. When the app opens, enter your Firebase config values:
   - **API Key**: The `apiKey` value
   - **Project ID**: The `projectId` value
   - **App ID**: The `appId` value
   - (Others are optional - they'll be auto-filled)
3. Click **"Initialize Firebase"**
4. You're ready to use Firebase! 🎉

## Alternative: Using Environment Variables

Instead of entering credentials in the UI each time, you can create a `.env` file:

1. Create a file named `.env` in the project root (same level as `package.json`)
2. Add these lines (replace with your actual values):

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. Restart your React app (`npm start`)
4. The app will automatically use these values (and skip the config screen)

**Note**: The `.env` file is already in `.gitignore` to keep your credentials safe.

## Firebase Free Tier Limits

The **Spark Plan (FREE)** includes:
- ✅ **1 GB storage** - Plenty for development/testing
- ✅ **10 GB/month bandwidth** - More than enough for personal projects
- ✅ **50K reads/day** - Perfect for small apps
- ✅ **20K writes/day** - Great for most use cases
- ✅ **20K deletes/day** - Sufficient for development

## Security Rules (After 30 Days)

After 30 days, you'll need to update Firestore security rules. Go to:
1. **Firestore Database** → **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{document=**} {
      allow read, write: if true;  // Allow all access (for development)
    }
  }
}
```

3. Click **"Publish"**

**Note**: For production, you should set up proper security rules. For development/testing, the above works fine.

## Troubleshooting

### "Firebase not initialized" error
- Make sure you entered all required fields (API Key, Project ID, App ID)
- Check that you copied the values correctly (no extra spaces)

### "Permission denied" error
- Make sure Firestore is in "test mode" (allows read/write)
- Or update your security rules (see above)

### Can't find Firestore
- Make sure you completed Step 3 (Enable Firestore Database)
- Look for "Firestore Database" in the left sidebar under "Build"

### "Collection not found"
- This is normal for the first time - the collection will be created automatically when you add your first item

## Quick Reference

- **Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
- **Collection Name**: `items` (auto-created on first use)
- **Database**: Firestore (NoSQL, similar to MongoDB)

## That's It! 🎉

Your React app now connects directly to Firebase - no backend needed! Everything is stored in Firebase and accessible from your React app.

