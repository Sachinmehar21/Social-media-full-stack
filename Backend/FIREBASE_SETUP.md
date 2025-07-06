# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database

## 2. Generate Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file

## 3. Environment Variables
Add these to your `.env` file:

```env
# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Other required variables
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GEMINI_API_KEY=your-gemini-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 4. Firestore Security Rules
Set up basic security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development - change for production
    }
  }
}
```

## 5. Collections Structure
The app will automatically create these collections:
- `users` - User profiles and data
- `posts` - Social media posts
- `comments` - Post comments
- `messages` - Direct messages

## 6. Test Connection
Run the server and check for "✅ Firebase connected!" message. 