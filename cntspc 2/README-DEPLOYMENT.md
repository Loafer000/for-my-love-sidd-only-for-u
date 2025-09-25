# SpaceConnect Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)
1. **Setup Database:**
   - Create free MongoDB Atlas account at https://cloud.mongodb.com
   - Create cluster and get connection string
   
2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```
   
3. **Add Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string

### Option 2: Netlify (Static + Serverless)
1. **Deploy Static Site:**
   - Drag & drop your folder to https://netlify.com
   - Or connect GitHub repository
   
2. **For Backend Functions:**
   - Create `netlify/functions/` folder
   - Move API endpoints to serverless functions

### Option 3: Railway (Full Backend)
1. **Connect GitHub:**
   - Push code to GitHub
   - Connect repository at https://railway.app
   
2. **Auto-Deploy:**
   - Railway automatically detects Node.js
   - Add MongoDB service from Railway marketplace

### Option 4: Heroku (Traditional)
1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   heroku create spaceconnect-app
   ```
   
2. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a spaceconnect-app
   git push heroku main
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Free Tier)
1. Create account at https://cloud.mongodb.com
2. Create new cluster (M0 Sandbox - Free)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Replace in `.env` or deployment environment variables

### Local Development
```bash
# Install dependencies
npm install

# Start MongoDB locally (if installed)
mongod

# Start development server
npm run dev
```

## 🔧 Environment Variables

Required for production:
- `MONGODB_URI`: Database connection string
- `PORT`: Server port (auto-set by most platforms)
- `NODE_ENV`: Set to "production"

## 📁 File Structure for Deployment
```
connectspace/
├── server.js          # Backend server
├── package.json       # Dependencies
├── vercel.json        # Vercel config
├── netlify.toml       # Netlify config
├── .env               # Environment variables
├── uploads/           # File uploads (create folder)
├── *.html             # Frontend pages
├── *.css              # Stylesheets
├── *.js               # Frontend scripts
└── README-DEPLOYMENT.md
```

## 🌐 Custom Domain Setup

### After Deployment:
1. **Buy Domain:** Namecheap, GoDaddy, etc.
2. **DNS Setup:** Point to your deployment platform
3. **SSL:** Automatically handled by Vercel/Netlify

### Example DNS Records:
```
Type: CNAME
Name: www
Value: your-app.vercel.app

Type: A
Name: @
Value: 76.76.19.61 (Vercel IP)
```

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] File upload validation
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Input sanitization

## 📊 Monitoring & Analytics

### Add to your site:
- Google Analytics
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Performance monitoring

## 🚀 Go Live Checklist

- [ ] Database connected
- [ ] Environment variables set
- [ ] File uploads working
- [ ] Forms submitting correctly
- [ ] Maps loading properly
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] SSL certificate active
- [ ] Custom domain configured

## 💡 Tips

1. **Start Simple:** Deploy static version first, add backend later
2. **Test Locally:** Always test with `npm run dev` before deploying
3. **Monitor Logs:** Check deployment platform logs for errors
4. **Backup Data:** Regular database backups
5. **Version Control:** Use Git for all changes

Your SpaceConnect platform is now ready for the internet! 🎉