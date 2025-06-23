# 1clickclearance Website

A modern, responsive waste clearance booking website built with React, TypeScript, and Tailwind CSS. Features online booking, Stripe payments, and comprehensive quote system.

## 🚀 **Live Demo**
**Current Site**: https://same-kmw069m7oc8-latest.netlify.app

## ✨ **Features**

### **🎯 Core Functionality**
- **📱 Mobile-responsive design** with professional UI
- **💳 Stripe payment integration** for secure online payments
- **📅 Online booking system** with date selection and customer details
- **🧮 Interactive pricing calculator** (volume-based and item-based)
- **📋 Quote system** for large jobs with file upload support
- **📧 Contact forms** with validation and analytics tracking
- **📏 Size guide** with visual examples and service explanations

### **🛠️ Technical Features**
- **⚡ React 18** with TypeScript for type safety
- **🎨 Tailwind CSS** for responsive styling
- **🏗️ Vite** for fast development and building
- **🔧 Netlify Functions** for serverless backend functionality
- **📊 Analytics integration** for conversion tracking
- **🎭 Component-based architecture** for maintainability

### **💼 Business Features**
- **🎯 Service-specific pricing** (Single Item, 1-7 Yard services)
- **🏠 Multiple clearance types** (Residential, Garden, Business)
- **📱 Professional contact information** and social media integration
- **🛡️ Trust indicators** (insurance, licensing, testimonials)
- **🌍 Service area coverage** (Cambridgeshire, Suffolk, Essex & More)

## 🚀 **Quick Start**

### **Development**
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:5173
```

### **Production Build**
```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## 📦 **Deployment**

### **🎯 Recommended: GitHub + Netlify (5 minutes)**

**See**: [`quick-deploy-setup.md`](./quick-deploy-setup.md) for step-by-step instructions.

**Quick Setup:**
1. **Create GitHub repository**
2. **Push code** from same.new
3. **Connect Netlify** to GitHub
4. **Automatic deployments** on every push!

**Daily Workflow:**
```bash
# Make changes in same.new, then:
git add .
git commit -m "Add new feature"
git push origin main
# ✅ Automatically deploys to live site!
```

### **📚 Deployment Guides**
- **[`quick-deploy-setup.md`](./quick-deploy-setup.md)** - 5-minute setup checklist
- **[`deployment-workflow.md`](./deployment-workflow.md)** - Complete workflow guide
- **[`stripe-live-setup.md`](./stripe-live-setup.md)** - Payment integration guide

## 💳 **Stripe Payment Setup**

### **Environment Variables**
```bash
# Add to Netlify Environment Variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### **Webhook Endpoint**
Set up in Stripe Dashboard:
```
https://your-site.netlify.app/.netlify/functions/stripe-webhook
```

**See**: [`stripe-live-setup.md`](./stripe-live-setup.md) for complete setup instructions.

## 🗂️ **Project Structure**

```
clearance-site/
├── src/
│   ├── pages/              # Page components
│   │   ├── BookingPage.tsx      # Multi-step booking flow
│   │   ├── PricingPage.tsx      # Interactive pricing calculator
│   │   ├── QuoteRequestPage.tsx # Large job quote system
│   │   ├── ContactPage.tsx      # Contact form
│   │   └── SizeGuidePage.tsx    # Service size guide
│   ├── utils/              # Utility functions
│   │   ├── analytics.ts         # Conversion tracking
│   │   └── validation.ts        # Form validation
│   ├── App.tsx             # Main app component
│   └── index.css           # Global styles & CSS variables
├── netlify/
│   └── functions/          # Serverless functions
│       ├── create-payment-intent.ts
│       └── stripe-webhook.ts
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── netlify.toml           # Netlify configuration
```

## 🎨 **Brand Styling**

### **Color Scheme**
```css
--brand-green: #4A7C26     /* Primary brand color */
--brand-orange: #d5642e    /* Accent color */
--brand-dark: #3e3d3a      /* Dark text */
--brand-light: #f8f9fa     /* Light backgrounds */
```

### **Components**
- **`.btn-primary`** - Primary action buttons
- **`.btn-secondary`** - Secondary action buttons
- **`.logo-watermark`** - Subtle logo background
- **Responsive grid layouts** with Tailwind CSS

## 🧪 **Testing**

### **Stripe Test Cards**
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### **Payment Flow Test**
1. Navigate to pricing page
2. Select service and proceed to booking
3. Enter test details and test card
4. Verify confirmation page
5. Check Stripe dashboard for payment record

### **Linting**
```bash
# Run linter
bun run lint

# Current status: 24 minor warnings (mostly React keys)
```

## 📊 **Current Status**

### **✅ Completed Features (Version 26)**
- ✅ Complete Stripe payment integration with Netlify Functions
- ✅ Multi-step booking flow with date selection
- ✅ Interactive pricing calculator (volume & item-based)
- ✅ Large job quote system with file uploads
- ✅ Professional contact forms with validation
- ✅ Size guide with visual examples
- ✅ Mobile-responsive design
- ✅ Environment-based configuration
- ✅ Error handling and fallbacks
- ✅ Analytics and conversion tracking

### **🎯 Ready for Production**
- ✅ Secure payment processing
- ✅ Professional UI/UX
- ✅ Complete business logic
- ✅ Mobile optimization
- ✅ SEO-friendly structure
- ✅ Error boundaries and handling

## 🔄 **Development Workflow**

### **In same.new**
1. **Develop features** with live preview
2. **Test thoroughly** using development server
3. **Version frequently** for backups

### **Deploy to Live**
```bash
# Quick deploy
git add .
git commit -m "feat: add new functionality"
git push origin main
# ✅ Live in 2-3 minutes!
```

### **Feature Development**
```bash
# Create feature branch for testing
git checkout -b feature/new-feature
# ... develop and test ...
git push origin feature/new-feature
# ✅ Test on preview URL before going live
```

## 🚀 **Next Steps**

### **For Live Deployment:**
1. **Set up GitHub repository** (see quick-deploy-setup.md)
2. **Connect Netlify** for automatic deployments
3. **Add Stripe keys** for payment processing
4. **Configure custom domain** (optional)
5. **Test end-to-end** with real payment flow

### **Future Enhancements:**
- 📧 Email notification system
- 📅 Calendar integration (Google Calendar/Calendly)
- 📊 Admin dashboard for booking management
- 💾 Database integration for booking storage
- 📱 SMS notifications via Twilio

## 📞 **Support**

- **Live Site**: https://same-kmw069m7oc8-latest.netlify.app
- **Documentation**: See `/docs` folder for detailed guides
- **Development**: same.new environment ready
- **Deployment**: GitHub + Netlify workflow configured

---

**Built with ❤️ for professional waste clearance services**
