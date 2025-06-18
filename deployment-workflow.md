# Deployment Workflow: same.new → GitHub → Netlify

## 🚀 Best Practice Workflow

### **Phase 1: One-Time Setup**

#### **Step 1: Create GitHub Repository**
1. **Go to GitHub.com** → Create new repository
2. **Name it**: `1clickclearance-website` (or your preferred name)
3. **Set as**: Public or Private (your choice)
4. **Don't initialize** with README (we'll push existing code)

#### **Step 2: Connect Netlify to GitHub**
1. **Go to Netlify Dashboard** → Sites
2. **Click "Add new site"** → "Import an existing project"
3. **Choose "Deploy with GitHub"**
4. **Authorize Netlify** to access your GitHub account
5. **Select your repository**: `1clickclearance-website`
6. **Configure build settings**:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (in Environment Variables)

#### **Step 3: Set Environment Variables in Netlify**
Go to **Site Settings** → **Environment Variables** → Add:
```
NODE_VERSION=18
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Phase 2: Initial Code Push**

#### **From same.new Terminal:**
```bash
# Initialize git in your project
cd clearance-site
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: 1clickclearance website v26"

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/1clickclearance-website.git

# Push to GitHub
git push -u origin main
```

**Result**: Netlify will automatically detect the push and deploy your site!

---

## 🔄 **Daily Development Workflow**

### **Option A: Direct Push (Recommended for Solo Development)**

#### **When you make changes in same.new:**
```bash
# After making changes and testing locally
git add .
git commit -m "Add new feature: [describe what you added]"
git push origin main
```

**Result**: Netlify automatically deploys the new version live!

### **Option B: Branch-Based (Recommended for Team/Careful Releases)**

#### **For new features:**
```bash
# Create feature branch
git checkout -b feature/new-booking-system

# Make your changes, then commit
git add .
git commit -m "Add enhanced booking validation"
git push origin feature/new-booking-system
```

#### **Netlify will create a preview URL** for your branch:
- **Main site**: `yoursite.netlify.app`
- **Preview**: `feature-new-booking-system--yoursite.netlify.app`

#### **When ready to go live:**
```bash
# Switch to main branch
git checkout main

# Merge your feature
git merge feature/new-booking-system

# Push to deploy live
git push origin main

# Clean up branch
git branch -d feature/new-booking-system
```

---

## 🎯 **Development Workflow Examples**

### **Scenario 1: Quick Fix**
```bash
# In same.new - fix a typo or small bug
git add .
git commit -m "Fix: Correct pricing display for 7-yard service"
git push origin main
# ✅ Live in 2-3 minutes
```

### **Scenario 2: New Feature Development**
```bash
# Create feature branch
git checkout -b feature/sms-notifications

# Develop SMS feature in same.new
# Test thoroughly
git add .
git commit -m "Add SMS notification system for booking confirmations"
git push origin feature/sms-notifications

# ✅ Test on preview URL: feature-sms-notifications--yoursite.netlify.app
# ✅ When satisfied, merge to main for live deployment
```

### **Scenario 3: Major Update**
```bash
# Create release branch
git checkout -b release/v2.0

# Make multiple commits as you develop
git add src/pages/NewDashboard.tsx
git commit -m "Add customer dashboard"

git add src/pages/AdminPanel.tsx
git commit -m "Add admin booking management"

# Push for preview
git push origin release/v2.0

# ✅ Test extensively on preview URL
# ✅ When ready, merge to main
```

---

## 🔧 **Advanced Netlify Features**

### **Deploy Previews**
- **Every branch** gets its own URL
- **Perfect for testing** before going live
- **Share with clients** for approval

### **Deploy Notifications**
Set up in **Site Settings** → **Build & Deploy** → **Deploy notifications**:
- **Slack notifications** when deploys succeed/fail
- **Email alerts** for deploy status
- **Webhook notifications** to other services

### **Rollback Capability**
- **Deploys tab** shows all previous versions
- **One-click rollback** if something breaks
- **Instant restoration** to any previous version

### **Build Caching**
- **Faster builds** with dependency caching
- **Optimized performance** automatically
- **CDN distribution** worldwide

---

## 📱 **Alternative Workflows**

### **Option 1: Manual Zip Upload (Simple)**
If you prefer not to use Git:
1. **Export project** from same.new
2. **Build locally**: `bun run build`
3. **Drag & drop** `dist` folder to Netlify
4. **Manual process** but simple

### **Option 2: Netlify CLI (Hybrid)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from same.new terminal
netlify deploy --prod --dir=dist
```

### **Option 3: GitHub Actions (Advanced)**
Set up automated testing + deployment:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: bun install
      - run: bun run build
      - run: bun run test
      # Deploy only if tests pass
```

---

## 🎛️ **Environment Management**

### **Development (.env.local)**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_development_key
STRIPE_SECRET_KEY=sk_test_development_key
```

### **Production (Netlify Environment Variables)**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_production_key
STRIPE_SECRET_KEY=sk_live_production_key
```

### **Staging Branch (Optional)**
Create a `staging` branch that deploys to a staging URL:
- **Main**: production site
- **Staging**: `staging--yoursite.netlify.app`
- **Feature branches**: individual preview URLs

---

## 🚨 **Pro Tips**

### **1. Commit Message Conventions**
```bash
git commit -m "feat: add email notifications"
git commit -m "fix: resolve payment validation bug"
git commit -m "docs: update deployment guide"
git commit -m "style: improve mobile responsiveness"
```

### **2. Use .gitignore**
```bash
# Already set up in your project
node_modules/
dist/
.env
.DS_Store
```

### **3. Branch Protection (Optional)**
In GitHub → Settings → Branches:
- **Require pull request reviews** before merging to main
- **Require status checks** (tests must pass)
- **Prevent direct pushes** to main

### **4. Netlify Build Plugins**
Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[plugins]]
  package = "netlify-plugin-submit-sitemap"
```

---

## 📊 **Recommended Setup for Your Use Case**

### **For Solo Development (Recommended):**
1. **GitHub repo** connected to Netlify
2. **Direct push to main** for updates
3. **Feature branches** for major changes
4. **Environment variables** in Netlify
5. **Rollback capability** for safety

### **For Team Development:**
1. **Branch protection** on main
2. **Pull request workflow**
3. **Automated testing**
4. **Staging environment**
5. **Deploy previews** for review

---

## 🎯 **Next Steps**

1. **Create GitHub repository**
2. **Connect to Netlify**
3. **Push your current code**
4. **Set up environment variables**
5. **Test the deployment workflow**
6. **Start using the Git workflow** for updates

This gives you **professional deployment practices** while keeping the **flexibility of same.new** for development!
