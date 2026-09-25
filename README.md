# KarigarConnect

An installable progressive web app for artisan product listings, AI-assisted voice entry, image processing, pricing, marketplace readiness, and business insights.

## Run locally

1. In `backend`, copy `.env.example` to `.env`, then add MongoDB and Gemini credentials when those features are needed.
2. Run `npm start` in `backend`.
3. Run `npm run dev` in `Frontend` and open the address Vite prints.

The app can be installed from the browser's **Install app** control. The profile works locally without a backend. Pricing uses an offline cost-and-time estimate if Gemini is not configured. The four-photo workflow uses local Python/OpenCV processing, so it does not consume Replicate credits; the first local Model/Lifestyle run may download its open-source model. Voice entry and translation require `GEMINI_API_KEY`. Product storage and insights require `MONGO_URI`.
