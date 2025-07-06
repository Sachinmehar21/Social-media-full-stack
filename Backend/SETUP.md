# Backend Setup Guide

## Environment Configuration

To fix the MongoDB connection error, you need to create a `.env` file in the Backend directory.

### Step 1: Create .env file

Create a file named `.env` in the `Backend/` directory with the following content:

```env
# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/social-media-app
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/social-media-app
MONGO_URL=mongodb://localhost:27017/social-media-app

# Server Port
PORT=3000

# JWT Secret Key (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Step 2: Install MongoDB (if not already installed)

#### Option A: Local MongoDB
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: MongoDB should run as a service automatically
   - Mac/Linux: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace the MONGO_URL in your .env file

### Step 3: Install Dependencies

```bash
cd Backend
npm install
```

### Step 4: Start the Server

```bash
npm start
# or
npm run dev
```

## Troubleshooting

If you still get connection errors:

1. **Check if MongoDB is running:**
   - Windows: Check Services app for "MongoDB"
   - Mac/Linux: `sudo systemctl status mongod`

2. **Test MongoDB connection:**
   ```bash
   mongosh mongodb://localhost:27017
   ```

3. **Check your .env file:**
   - Make sure it's in the Backend directory
   - Verify the MONGO_URL is correct
   - No spaces around the = sign

4. **For MongoDB Atlas:**
   - Ensure your IP address is whitelisted
   - Check username/password in connection string
   - Verify cluster is active 