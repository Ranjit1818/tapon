# TapOnn - Digital Profile Platform

A world-class, highly responsive, dynamic, and animated end-to-end website for TapOnn, a digital profile platform for NFC-based smart sharing and lead management.

## 🌟 Features

### 🎨 Design & UX
- **Mobile-First Design** - Optimized for all devices
- **Dark/Light Mode Toggle** - Seamless theme switching
- **PWA Compatibility** - Offline support and app-like experience
- **Responsive Layout** - Perfect on desktop, tablet, and mobile

### 🎭 Animations & Interactions
- **Framer Motion** - Smooth page transitions and micro-interactions
- **GSAP** - Advanced scroll-triggered animations
- **Lottie** - Rich animated illustrations
- **Typed.js** - Dynamic text typing effects
- **Scroll Animations** - Reveal animations on scroll

### 📱 Core Features
- **Hero Section** - Animated header with "Share Instantly. Connect Effortlessly."
- **Product Showcase** - Interactive product cards with hover effects
- **Team Dashboard** - CRM integrations and lead management
- **Profile Pages** - Dynamic user profiles with social links
- **Analytics** - Google Analytics integration
- **Lead Tracking** - Comprehensive lead management system

### 🔧 Technical Stack

#### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Professional animation library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons

#### Backend Ready
- **Node.js/Express** - API server (to be implemented)
- **MongoDB** - Database (to be implemented)
- **JWT Authentication** - Secure user management
- **Rate Limiting** - API protection
- **Encrypted Data** - User data security

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taponn-website.git
   cd taponn-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── dashboard/        # Dashboard components
│   ├── layout/          # Layout components
│   └── sections/        # Page sections
├── contexts/            # React contexts
├── pages/              # Page components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── styles/             # Global styles
└── assets/             # Static assets
```

## 🎯 Key Pages

### 1. Homepage (`/`)
- Hero section with animated slogan
- Why Digital Profile section
- Products showcase
- Tap and redirect feature
- Teams section
- Features overview
- App section
- Trusted by section
- About section

### 2. Products (`/products`)
- Product listings with filters
- Detailed product information
- Interactive product cards
- Comparison features

### 3. Product Details (`/product/:slug`)
- Dynamic product pages
- Detailed specifications
- Interactive demos
- Related products

### 4. About (`/about`)
- Company timeline
- Team information
- Mission and vision
- Values and culture

### 5. Contact (`/contact`)
- Contact form
- Office locations
- Support information
- FAQ section

### 6. Dashboard (`/dashboard/*`)
- User profile management
- Analytics dashboard
- Lead management
- Settings and preferences

### 7. Profile Pages (`/profile/:username`)
- Dynamic user profiles
- Social media integration
- Contact information
- Professional details

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#3b82f6` to `#1d4ed8`)
- **Secondary**: Green (`#22c55e`)
- **Accent**: Orange (`#f2750d`)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Display**: Poppins (headings)
- **Body**: Inter (body text)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- **Buttons**: Primary, Secondary, Accent variants
- **Cards**: Hover effects and shadows
- **Forms**: Consistent styling and validation
- **Navigation**: Responsive with mobile menu

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GA_MEASUREMENT_ID=your-ga-id
```

### Tailwind Configuration
Custom animations and colors are defined in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        secondary: { /* ... */ },
        accent: { /* ... */ }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // ... more animations
      }
    }
  }
}
```

## 📊 Analytics & Tracking

### Google Analytics
- Page view tracking
- Event tracking for user interactions
- Lead generation tracking
- Conversion tracking

### Custom Events
- Profile views
- NFC card scans
- QR code scans
- Demo bookings
- App downloads

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Rate Limiting** - API protection
- **Data Encryption** - User data security
- **HTTPS Only** - Secure connections
- **CSP Headers** - Content Security Policy

## 📱 PWA Features

- **Offline Support** - Service worker caching
- **App-like Experience** - Full-screen mode
- **Install Prompt** - Add to home screen
- **Background Sync** - Offline data sync

## 🚀 Performance

### Optimization
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format support
- **Bundle Analysis** - Optimized bundle sizes
- **Lighthouse Score** - 90+ performance score

### Loading Strategy
- **Skeleton Loading** - Placeholder content
- **Progressive Loading** - Content appears as needed
- **Preloading** - Critical resources preloaded

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@taponn.com
- **Documentation**: [docs.taponn.com](https://docs.taponn.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/taponn-website/issues)

## 🙏 Acknowledgments

- **Framer Motion** for amazing animations
- **Tailwind CSS** for the utility-first approach
- **Lucide** for beautiful icons
- **GSAP** for professional animations
- **Vite** for the fast development experience

---

Built with ❤️ by the TapOnn Team 