# Deployment Finalization

I've already pushed the **Render Blueprint (`render.yaml`)**, **Vercel Manifest**, and **Dockerfiles** to your repository at `https://github.com/garvitsahni/Zyphor`.

## 1. Backend: Render Blueprint (1 Click)
1. Go to [Render Blueprints](https://dashboard.render.com/select-repo?type=blueprint).
2. Select your `Zyphor` repo.
3. Fill in the requested Environment Variables:
   - `JWT_SECRET`: (Keep it long and secure)
   - `GEMINI_API_KEY`: `AIzaSyBH6NBZDh6WqTVL5bxDeod82StuWSMTpA8`
   - `MONGODB_URI`: (Your live Atlas cluster link)
4. Click **Deploy**.

## 2. Frontend: Vercel Import (1 Click)
1. Go to [Vercel New Project](https://vercel.com/new).
2. Import `garvitsahni/Zyphor`.
3. **Crucial**: Edit "Project Settings" and set the **Root Directory** to `frontend`.
4. Add `NEXT_PUBLIC_API_URL` pointing to your new Render backend.
5. Click **Deploy**.

---
*Created by Antigravity*
