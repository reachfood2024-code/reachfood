# ReachFood

A modern e-commerce platform for self-heating ready meals that brings authentic flavors from around the world to your table in just 3-5 minutes.

## About

ReachFood is an innovative food delivery platform specializing in sustainable, self-heating meals. Our mission is to provide convenient, nutritious, and culturally authentic meals without requiring microwaves, stoves, or electricity.

## Features

- **Modern E-Commerce Experience**: Intuitive shopping interface with cart management and streamlined checkout
- **Bilingual Support**: Full English and Arabic support with RTL (Right-to-Left) layout for Arabic
- **Self-Heating Technology**: Innovative packaging that heats meals in 3-5 minutes without external power
- **Product Catalog**: Browse diverse meal options across multiple cuisines
- **Smart Filtering**: Filter products by category, price, and availability
- **Secure Checkout**: Complete order processing with multiple payment options
- **WhatsApp Integration**: Direct customer support through floating WhatsApp button
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **FAQ Section**: Comprehensive answers to common questions
- **Partner Program**: Information for potential business partners

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 3.4.19
- **State Management**: React Context API
- **Code Quality**: ESLint with React plugins

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reachfood
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build production-ready application
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
reachfood/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── cart/         # Shopping cart components
│   │   ├── home/         # Home page sections
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── shop/         # Shop page components
│   ├── context/          # React Context providers
│   │   ├── CartContext.jsx
│   │   └── LanguageContext.jsx
│   ├── data/             # Static data and translations
│   │   ├── products.js
│   │   └── translations.js
│   ├── pages/            # Page components
│   │   ├── About.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── FAQ.jsx
│   │   ├── Home.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Partner.jsx
│   │   ├── ProductCheckout.jsx
│   │   └── Shop.jsx
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Key Features Explained

### Bilingual Interface
The application supports both English and Arabic languages with automatic RTL layout switching for Arabic content, ensuring a native experience for all users.

### Self-Heating Meals
ReachFood's innovative self-heating technology allows meals to be heated without any external power source, making them perfect for:
- Emergency situations
- Outdoor activities
- Travel
- Areas with limited kitchen access

### Sustainable Approach
All packaging is 100% recyclable, combining convenience with environmental responsibility.

## Development

### Adding New Products
Products can be added or modified in `src/data/products.js`:

```javascript
{
  id: 1,
  name: "Product Name",
  price: 8.00,
  originalPrice: null,
  image: "/path/to/image.jpg",
  category: "category-name",
  inStock: true,
  featured: true,
  description: "Product description"
}
```

### Adding Translations
Translations are managed in `src/data/translations.js` with separate objects for English (`en`) and Arabic (`ar`).

## Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Created By

**Azeddine Zellag**
- Full Stack Developer with a Master's degree in Psychology
- Specializes in building high-revenue SaaS platforms and AI-driven applications
- Expert in modern web technologies and user experience design
- Email: autonomy.owner@gmail.com

## Team

ReachFood is powered by a multidisciplinary team of experts:
- **Amera Otoum** - CEO & Founder
- **Dr. Aljawharah Alsubaie** - Food Advisor
- **Dr. Ali Ali Redha** - Food R&D Advisor
- **Dr. Mahmoud Alkhateib** - Emergency Nutrition Advisor
- **Enes Hurmuzlu** - AI Advisor

## License

Copyright © 2024 ReachFood. All rights reserved.

## Contact

For inquiries, please visit our Contact page or reach out through the integrated WhatsApp support.

---

Built with React + Vite
