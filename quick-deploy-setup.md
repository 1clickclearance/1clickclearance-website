# 🚀 Quick Deploy Setup Checklist

## ✅ **5-Minute Setup to Deploy Live**

### **Prerequisites**
- [ ] GitHub account (free)
- [ ] Netlify account (free)
- [ ] Your current code in same.new

### **Step 1: Create GitHub Repository (2 minutes)**
1. Go to [github.com](https://github.com) → **New repository**
2. Repository name: `1clickclearance-website`
3. Set to **Public** or **Private** (your choice)
4. **Don't** initialize with README
5. Click **Create repository**

### **Step 2: Push Code from same.new (2 minutes)**
In same.new terminal:
```bash
cd clearance-site

# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: 1clickclearance website"
git remote add origin https://github.com/YOURUSERNAME/1clickclearance-website.git
git push -u origin main
```

### **Step 3: Connect Netlify (1 minute)**
1. Go to [netlify.com](https://netlify.com) → **New site from Git**
2. Choose **GitHub** → Authorize Netlify
3. Select your repository: `1clickclearance-website`
4. Build settings:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**

### **Step 4: Add Environment Variables (Optional)**
If you want Stripe payments to work:
1. **Site settings** → **Environment variables**
2. Add your Stripe keys (see `stripe-live-setup.md`)

---

## 🔄 **Daily Workflow After Setup**

### **Option A: Instant Deploy (Recommended)**
```bash
# Make changes in same.new, then:
git add .
git commit -m "Add new feature"
git push origin main
# ✅ Live automatically in 2-3 minutes!
```

### **Option B: Preview First**
```bash
# Create feature branch for testing
git checkout -b feature/new-update
git add .
git commit -m "Add new feature"
git push origin feature/new-update
# ✅ Test on preview URL, then merge to main when ready
```

---

## 🎯 **What You Get**

✅ **Automatic deployments** when you push to GitHub
✅ **Custom domain** support (yourname.com)
✅ **SSL certificate** (https://) automatically
✅ **Global CDN** for fast loading worldwide
✅ **Preview URLs** for testing branches
✅ **One-click rollback** if something breaks
✅ **Build logs** to debug any issues

---

## 🆘 **Troubleshooting**

### **Build Fails**
- Check build logs in Netlify dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version (set `NODE_VERSION=18` in environment variables)

### **Environment Variables Not Working**
- Double-check variable names match exactly
- Restart build after adding variables
- Check they start with `VITE_` for frontend variables

### **Git Push Issues**
```bash
# If remote already exists error:
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

---

## 🚀 **Ready to Go Live?**

After setup, your workflow is:
1. **Develop** in same.new ✨
2. **Commit & push** to GitHub 📤
3. **Automatic deployment** to Netlify 🚀
4. **Live site** updates in minutes ⚡

**Current Live Site**: https://same-kmw069m7oc8-latest.netlify.app

**Your New Site Will Be**: https://your-site-name.netlify.app

---

## 🎁 **Bonus Features**

### **Custom Domain** (Optional)
1. Buy domain from any provider
2. In Netlify: **Domain settings** → **Add custom domain**
3. Update DNS settings as shown
4. **Free SSL** certificate automatically applied

### **Form Handling**
- Contact forms work automatically with Netlify
- No backend code needed
- Submissions appear in Netlify dashboard

### **Analytics**
- Built-in visitor analytics
- No configuration needed
- Privacy-focused (no cookies)

**Total Setup Time**: ~5 minutes
**Ongoing Effort**: Just `git push` when ready to deploy! 🎉
