# Troubleshooting Guide

## Common Firebase/Firestore Errors

### "Permission denied" Error

**Cause:** Firestore security rules are blocking read/write access.

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Update your rules to allow access (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

**Note:** This allows all access. For production, you should set up proper security rules.

### "Firestore unavailable" Error

**Possible Causes:**
1. Firestore Database not enabled
2. Incorrect Firebase configuration (API Key, Project ID, or App ID)
3. Network connectivity issues

**Solution:**
1. **Check Firestore is enabled:**
   - Go to Firebase Console
   - Navigate to Firestore Database
   - Make sure it says "Enabled" (not "Get Started")

2. **Verify your .env file:**
   - Check that all values are correct (no extra spaces, quotes, etc.)
   - Required: `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_APP_ID`
   - Restart your development server after changing .env

3. **Check your Firebase config:**
   - Go to Firebase Console → Project Settings → Your apps → Web app
   - Compare the values with your .env file
   - Make sure you copied the entire API key (it's very long)

### "Invalid Firebase configuration" Error

**Cause:** One or more Firebase config values are incorrect or missing.

**Solution:**
1. Check your `.env` file has all required values:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   ```

2. Make sure there are no quotes around the values in .env
3. Make sure there are no spaces before/after the `=`
4. Restart your development server (`npm start`)

### Still Having Issues?

1. **Check browser console** - Look for detailed error messages
2. **Verify Firebase project** - Make sure you're using the correct Firebase project
3. **Check Firestore status** - Ensure Firestore Database shows "Enabled" in Firebase Console
4. **Test connection** - Try accessing Firebase Console in your browser to ensure you can reach Firebase servers

