# ConnectSpace Frontend

A modern React.js frontend application for the ConnectSpace rental platform, connecting tenants and landlords through a trusted, transparent interface.

## 🚀 Features

### User Interface & Experience
- **Responsive Design**: Built with Tailwind CSS for mobile-first, responsive layouts
- **Modern Components**: Clean, accessible UI components with hover effects and animations
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loading and spinners for better UX
- **Error Boundaries**: Graceful error handling with user-friendly messages

### Core Functionality
- **Advanced Search**: Smart property search with filters (location, price, type, amenities)
- **Property Listings**: Grid and map view for search results
- **Property Details**: Comprehensive property pages with image galleries
- **User Authentication**: Login/logout with persistent sessions
- **Landlord Dashboard**: Property management interface for landlords
- **Reviews System**: Rating and review system for properties
- **Contact Forms**: Direct communication with property owners

### Technical Features
- **React Router**: Client-side routing for seamless navigation
- **Context API**: State management for authentication and property data
- **Form Validation**: React Hook Form with Yup validation schemas
- **API Ready**: Structured for easy backend integration
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM 6.x
- **Forms**: React Hook Form + Yup validation
- **Notifications**: React Hot Toast
- **Maps**: Leaflet.js (ready for integration)
- **HTTP Client**: Axios (ready for API calls)

## 📦 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS:**
   ```bash
   npx tailwindcss init -p
   ```

## 🚀 Getting Started

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Common/          # Generic components (LoadingSpinner, etc.)
│   ├── Home/            # Homepage specific components
│   ├── Layout/          # Navigation, Footer components
│   ├── Map/             # Map integration components
│   ├── Property/        # Property related components
│   └── Search/          # Search and filter components
├── contexts/            # React Context providers
│   ├── AuthContext.js   # Authentication state management
│   └── PropertyContext.js # Property data management
├── pages/               # Page components
│   ├── Homepage.js      # Landing page
│   ├── SearchResults.js # Property search results
│   ├── PropertyDetails.js # Individual property page
│   ├── LandlordDashboard.js # Property management
│   ├── AboutUs.js       # About page
│   ├── ContactUs.js     # Contact form
│   └── NotFound.js      # 404 page
├── App.js              # Main app component with routing
├── index.js            # App entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Key Components

### SearchBar Component
- Advanced search with location, type, and price filters
- Expandable advanced filters section
- Form validation with error handling

### PropertyCard Component
- Responsive property listing cards
- Image carousel, amenities display
- Verified landlord badges
- Favorite button and rating display

### PropertyDetails Component
- Comprehensive property information
- Image gallery with modal view
- Contact landlord functionality
- Reviews and ratings system
- Integrated map view

### LandlordDashboard Component
- Property management interface
- Analytics and statistics
- Tenant management
- Revenue tracking

## 🔧 Configuration

### Tailwind CSS
Custom theme configuration with ConnectSpace branding:
- Primary colors: Blue palette
- Custom animations: fade-in, slide-up
- Component classes for buttons, cards, inputs

### Form Validation
Yup schemas for comprehensive form validation:
- Search forms with price range validation
- Contact forms with email validation
- Review forms with rating requirements

## 🌐 API Integration Ready

The frontend is structured for easy backend integration:

```javascript
// Example API integration points
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Property search
export const searchProperties = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/properties/search`, { params });
  return response.data;
};

// User authentication
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid Layouts**: Responsive grid systems for property listings
- **Navigation**: Collapsible mobile menu

## 🔐 Security Features

- **Input Sanitization**: All user inputs are validated and sanitized
- **XSS Prevention**: React's built-in XSS protection
- **Authentication**: Secure token-based authentication ready
- **Form Validation**: Client-side and server-side validation ready

## 🎯 Performance Optimizations

- **Lazy Loading**: Code splitting for better initial load times
- **Image Optimization**: Placeholder images with lazy loading ready
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Service worker ready for PWA implementation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

The app is ready for deployment to various platforms:

### Vercel/Netlify
```bash
npm run build
# Deploy the build folder
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Sky Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600, 700)
- **Body**: Regular (400) and Medium (500)

### Components
- **Buttons**: Primary, Secondary, Ghost variants
- **Cards**: Shadow-based elevation system
- **Forms**: Consistent input styling with focus states
- **Badges**: Status indicators with color coding

---

**ConnectSpace Frontend** - Built with ❤️ using React and Tailwind CSS