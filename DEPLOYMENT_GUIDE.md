# Deploying TapOnn to Vercel

This guide outlines the steps to deploy your full-stack application (React Frontend + Node.js Backend) to Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Vercel CLI** (Optional but recommended): Install globally via terminal:
    ```bash
    npm install -g vercel
    ```

## Step 1: Prepare Environment Variables

Before deploying, make sure you have your secrets ready. You will NOT upload your `.env` file. Instead, you will enter these into Vercel.

**Required Variables:**
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name.
- `CLOUDINARY_API_KEY`: Cloudinary API Key.
- `CLOUDINARY_API_SECRET`: Cloudinary API Secret.
- `NODE_ENV`: Set this to `production`.
- `VITE_API_URL`: Set this to `/api` (This relative path is crucial).

> [!NOTE]
> `FRONTEND_URL` is also used by the backend for CORS. Vercel automatically sets `NEXT_PUBLIC_VERCEL_URL` but for your custom Express app, we'll set `FRONTEND_URL` manually after the first deploy when we know the domain.

## Step 2: Deploy using Vercel CLI

1.  Open your terminal in the project root (`d:\letsconnect_prototype\tapon`).
2.  Run the deploy command:
    ```bash
    vercel
    ```
3.  Follow the interactive prompts:
    - **Set up and deploy?**: `y`
    - **Which scope?**: (Select your account)
    - **Link to existing project?**: `n` (if first time)
    - **Project Name**: `taponn-app` (or your choice)
    - **In which directory is your code located?**: `./` (Just press Enter)
    - **Want to modify these settings?**: `n` (We already created `vercel.json` to handle this)

4.  **Wait for Build**: Vercel will upload your code and build the frontend.

## Step 3: Add Environment Variables (in Dashboard)

**IMMEDIATELY** after the first deployment starts (or fails), go to the Vercel Dashboard:

1.  Go to [vercel.com/dashboard](https://vercel.com/dashboard) and select your project.
2.  Go to **Settings** > **Environment Variables**.
3.  Add all the variables from Step 1.
4.  **Redeploy**: If the initial deploy failed (because variables were missing), go to the **Deployments** tab, click the three dots on the failed deploy, and select **Redeploy**.

## Step 4: Finalize Configuration

1.  Get your new Vercel URL (e.g., `https://taponn-app.vercel.app`).
2.  Go back to **Settings** > **Environment Variables**.
3.  Add/Update `FRONTEND_URL` with this new https value (no trailing slash).
4.  Redeploy one last time to ensure CORS is set correctly.

## Verification

- Visit your new URL.
- Try logging in.
- Try uploading a profile picture (this tests the Cloudinary integration).
