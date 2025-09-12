# 📱 T-Mobile Smart Quote Optimizer

A **Progressive Web App (PWA)** designed for T-Mobile store representatives to instantly calculate the best possible deals for customers by comparing ALL promotion combinations, trade-in scenarios, and plan options.

🔗 **[Live Demo](http://localhost:5173/)** | 📊 **[GitHub](https://github.com/stuinfla/tmobile-smart-quote-optimizer)**

## 🎯 Key Features

### Smart Deal Optimization
- **4+ Scenario Comparison**: Automatically calculates trade-in, Keep & Switch, selective trade, and bundle scenarios
- **Intelligent Analysis**: Discovers when NOT trading in saves more money
- **Promotion Stacking**: Finds optimal combinations of all available promotions
- **Real-time Calculations**: Instant results as customer preferences change

### Mobile-First Design
- **90% Mobile Optimized**: Built specifically for tablet/phone use in stores
- **Touch-Friendly**: Large buttons, swipe gestures, mobile-optimized forms
- **Offline Capable**: Works without internet using PWA service workers
- **Fast Performance**: Sub-second calculations with Vite + React

### Professional Output
- **Beautiful Quotes**: Professional PDF-ready quotes with T-Mobile branding
- **Customer-Ready**: Clean layout perfect for customer presentation
- **Email/Print**: Easy sharing via email or direct printing
- **Quote Tracking**: Unique quote numbers for follow-up

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/stuinfla/tmobile-smart-quote-optimizer.git

# Navigate to project
cd tmobile-smart-quote-optimizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 💻 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Mobile-first CSS with T-Mobile brand colors
- **PWA**: Service Worker + Web App Manifest
- **Optimization**: Advanced calculation engine
- **State**: React Hooks for state management

## 📱 Progressive Web App Features

- **Install to Home Screen**: Add to device like native app
- **Offline Mode**: Works without internet connection
- **Push Notifications**: Alert reps to new promotions (coming soon)
- **Auto Updates**: Seamlessly updates in background

## 🎨 T-Mobile Brand Integration

- Official T-Mobile Magenta (#E20074)
- Brand-compliant typography and spacing
- T-Mobile logo and visual identity
- Professional quote templates

## 🔧 Core Components

### 1. Conversation Flow
Dynamic questionnaire that adapts based on customer type:
- New vs. Existing customer paths
- Smart device selection
- Accessory bundle detection

### 2. Optimization Engine
Sophisticated calculation system comparing:
- Trade-in values vs. Keep & Switch credits
- BOGO promotions with new line requirements
- Bundle savings (Home Internet, Watch, Tablet)
- Insider discounts and special offers

### 3. Quote Generator
Professional quote creation with:
- Customer information capture
- Rep details and store ID
- Itemized pricing breakdown
- Promotion highlights
- Next steps checklist

## 📊 Deal Scenarios

The app automatically calculates these scenarios:

1. **Maximum Trade-In**: Best value when trading all devices
2. **Keep & Switch**: Keep phones, get bill credits
3. **Smart Mix**: Optimal combination of trade-in and keep
4. **Bundle Maximum**: All available bundles for maximum savings

## 🛠️ Development

### Project Structure
```
tmobile-optimizer/
├── src/
│   ├── components/     # React components
│   ├── data/           # Phone, plan, promotion data
│   ├── utils/          # Optimization engine
│   └── App.jsx         # Main application
├── public/
│   ├── manifest.json   # PWA manifest
│   └── sw.js          # Service worker
```

### Key Files
- `src/utils/optimizer.js` - Deal calculation engine
- `src/data/phoneData.js` - Current phone pricing
- `src/data/promotions.js` - Active promotions
- `src/data/plans.js` - T-Mobile plan details

## 📝 Data Updates

### Updating Phone Prices
Edit `src/data/phoneData.js`:
```javascript
iPhone_17: {
  name: "iPhone 17",
  variants: {
    "256GB": 829.99,
    "512GB": 1029.99
  }
}
```

### Adding Promotions
Edit `src/data/promotions.js`:
```javascript
NEW_PROMO: {
  name: "Promotion Name",
  value: 830,
  requirements: {
    plan: "GO5G_Next",
    new_line: true
  }
}
```

## 🚢 Deployment

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewPromotion`)
3. Commit changes (`git commit -m 'Add new promotion'`)
4. Push to branch (`git push origin feature/NewPromotion`)
5. Open Pull Request

## 📄 License

MIT License - Free for T-Mobile internal use

## 👥 Support

For issues or questions:
- Create an issue on [GitHub](https://github.com/stuinfla/tmobile-smart-quote-optimizer/issues)
- Internal T-Mobile support: Contact store systems team

## 🎯 Roadmap

- [ ] Promotion auto-update via API
- [ ] Customer SMS quote delivery
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with T-Mobile systems

---

**Built with ❤️ for T-Mobile by the Smart Quote Team**