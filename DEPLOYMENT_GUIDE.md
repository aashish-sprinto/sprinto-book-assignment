# Sprinto Books - Deployment Guide

## Quick Answer: YES, but with considerations

✅ **Frontend on Vercel**: YES - Perfect fit  
❌ **Backend on Vercel**: NO - Not supported for traditional Node servers  
✅ **Alternative**: Deploy backend elsewhere + frontend on Vercel

---

## Deployment Strategy

### Option 1: Recommended - Separate Deployments ⭐

**Frontend on Vercel** + **Backend on Railway/Heroku/AWS**

This is the industry-standard approach and works perfectly for your setup.

#### Frontend Deployment (Vercel) ✅

**Why Vercel?**
- Native Next.js support (Vercel created Next.js)
- Zero configuration needed
- Free tier available
- Excellent performance
- CDN included
- Automatic deployments from git

**How to Deploy:**
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to vercel.com and sign up
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Select the "frontend" folder as root directory
# 6. Add environment variables:
#    NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-url/graphql

# 7. Deploy! (automatic on every push)
```

**Configuration File** (create `frontend/vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

#### Backend Deployment Options

**Option A: Railway** (Recommended for Node.js) ⭐⭐⭐

```bash
# 1. Sign up at railway.app
# 2. Connect your GitHub repo
# 3. Create new project
# 4. Select "Node.js" environment
# 5. Add environment variables:
#    DATABASE_URL=postgresql://...
#    MONGO_URI=mongodb+srv://...
#    JWT_SECRET=your-secret
#    FRONTEND_URL=https://your-vercel-app.vercel.app

# 6. Deploy!
```

**Pros:**
- Free tier: $5/month credits
- Perfect for Node.js apps
- PostgreSQL support
- MongoDB support
- Easy environment variables

**Option B: Heroku** (Previously popular)

```bash
# Heroku ended free tier in Nov 2022
# Cost starts at $7/month
# Still a good option for production
```

**Option C: AWS** (More complex but scalable)

- ECS/Fargate for containerized deployment
- RDS for PostgreSQL
- MongoDB Atlas for MongoDB
- More expensive but very scalable

**Option D: DigitalOcean** (Budget-friendly)

- $4-5/month for basic droplet
- Full control over server
- Good documentation

---

## Full Deployment Setup

### Step 1: Frontend on Vercel

```bash
# In frontend directory
cd frontend

# Ensure everything works locally
npm run build
npm start

# Push to GitHub
cd ..
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Vercel Configuration**:
1. Go to vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Framework: Next.js (auto-detected)
6. Root Directory: `frontend`
7. Environment Variables:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://your-api.railway.app/graphql
   ```
8. Click Deploy

### Step 2: Backend on Railway

```bash
# In backend directory
cd backend

# Ensure everything works locally
npm run dev

# Create .env file with production values
cat > .env << 'EOF'
NODE_ENV=production
PORT=4000
DB_HOST=your-postgres-host
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=sprinto_books
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/sprinto
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-app.vercel.app
EOF

# Push to GitHub
cd ..
git add .
git commit -m "Backend deployment ready"
git push origin main
```

**Railway Setup**:
1. Go to railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repo and "backend" directory
6. Add services:
   - PostgreSQL (auto-provisioned)
   - MongoDB (connect to Atlas)
7. Set Environment Variables
8. Deploy!

### Step 3: Connect Frontend to Backend

Update `frontend/.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-on-railway.railway.app/graphql
```

Redeploy frontend on Vercel (automatic on push)

---

## Database Setup for Deployment

### PostgreSQL (AWS RDS or Railway)

**Railway provides PostgreSQL automatically**, but you can also use:
- AWS RDS PostgreSQL
- DigitalOcean Managed Database
- Supabase (PostgreSQL hosting)

**Connection String Format:**
```
postgresql://user:password@host:5432/dbname
```

### MongoDB (Atlas)

```bash
# 1. Go to mongodb.com/cloud/atlas
# 2. Create account
# 3. Create free M0 cluster
# 4. Get connection string:
#    mongodb+srv://user:password@cluster.mongodb.net/dbname
# 5. Use in environment variables
```

---

## Environment Variables Checklist

### Frontend (.env.local in Vercel)
```
NEXT_PUBLIC_GRAPHQL_URL=https://your-api-url/graphql
```

### Backend (on Railway/Heroku)
```
NODE_ENV=production
PORT=4000
DB_HOST=your-postgres-host
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_NAME=sprinto_books
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/sprinto
JWT_SECRET=your-very-secret-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## Deployment Checklist

### Before Deployment

- [ ] All tests passing locally (`npm run test`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs without errors (`npm run dev`)
- [ ] No hardcoded secrets in code
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] CORS configuration correct
- [ ] JWT secrets generated (use strong random strings)

### Deployment Process

- [ ] Create Vercel account
- [ ] Create Railway/Heroku account
- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set environment variables on both
- [ ] Test API connection
- [ ] Verify CORS headers
- [ ] Test full user flow

### Post-Deployment

- [ ] Monitor error logs
- [ ] Test signup/login
- [ ] Test CRUD operations
- [ ] Check database connectivity
- [ ] Verify JWT tokens work
- [ ] Test in production

---

## Cost Breakdown

### Vercel (Frontend)
- **Free tier**: Generous limits, pay-as-you-go
- **Production**: $20/month Pro plan (optional)
- **Typical cost**: Free or $5-20/month

### Railway (Backend)
- **Free tier**: $5/month credits
- **PostgreSQL**: Included in free tier
- **MongoDB Atlas**: Free tier available
- **Typical cost**: Free or $5-20/month

### MongoDB Atlas (Database)
- **Free tier**: 512MB storage
- **Paid**: Starting at $0.30/month

### Total Monthly Cost
**FREE to $20/month** depending on usage

---

## Troubleshooting

### Common Issues

#### CORS Errors
**Solution**: Update `FRONTEND_URL` environment variable in backend
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### Database Connection Failed
**Solution**: 
1. Check connection string in environment variables
2. Verify database is running
3. Check firewall rules
4. Verify credentials

#### 404 on GraphQL Endpoint
**Solution**:
1. Verify backend is deployed
2. Check `NEXT_PUBLIC_GRAPHQL_URL` is correct
3. Verify endpoint is `/graphql`

#### Timeout Errors
**Solution**:
1. Upgrade Railway plan
2. Check database queries
3. Add indexes to frequently queried fields

---

## Recommended Deployment Path

```
1. Deploy Frontend to Vercel (5 minutes)
   ↓
2. Deploy PostgreSQL on Railway (2 minutes)
   ↓
3. Deploy MongoDB on Atlas (5 minutes)
   ↓
4. Deploy Backend to Railway (5 minutes)
   ↓
5. Update Environment Variables (2 minutes)
   ↓
6. Test Full App (10 minutes)
   ↓
✅ LIVE!
```

**Total Time: ~30 minutes**

---

## Deployment URLs

After deployment, your app will be available at:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/graphql`
- **GraphQL Playground**: `https://your-backend.railway.app/graphql`

---

## Important Notes

### Vercel Supports
✅ Next.js (native)
✅ React (via Next.js)
✅ Static files
✅ API routes
✅ Environment variables
✅ Custom domains
✅ SSL/TLS (automatic)

### Vercel Does NOT Support
❌ Traditional Node.js Express servers
❌ Long-running processes
❌ WebSockets (in free tier)
❌ File uploads to filesystem

### For Your Backend
Since your backend is Express + Apollo GraphQL:
- Deploy to **Railway** ⭐ (Recommended)
- Deploy to **Heroku** (Paid only now)
- Deploy to **DigitalOcean** (Full control)
- Deploy to **AWS** (More complex)

---

## Final Recommendation

**Use this setup:**
- **Frontend**: Vercel (FREE or $20/month)
- **Backend**: Railway (FREE tier with $5 credits)
- **PostgreSQL**: Railway included
- **MongoDB**: MongoDB Atlas (FREE tier)

**Total Cost**: FREE (using free tiers)

**Deployment Time**: ~30 minutes

**Maintenance**: Minimal (automatic deployments)

---

## Next Steps

1. **Today**: Prepare for deployment
   - Add all environment variables
   - Run all tests
   - Build locally

2. **Tomorrow**: Deploy frontend to Vercel
   - Connect GitHub
   - Deploy with one click

3. **Tomorrow**: Deploy backend to Railway
   - Connect GitHub
   - Add environment variables
   - Deploy

4. **Tomorrow**: Test and verify
   - Test user signup
   - Test book creation
   - Test filtering

**Your app will be LIVE!** 🚀

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js Deployment: https://nextjs.org/docs/deployment

Good luck with your deployment! 🎉
