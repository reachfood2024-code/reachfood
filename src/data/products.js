export const products = [
  {
    id: 1,
    name: "Thai Basil Chicken",
    price: 12.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: true,
    description: "Aromatic Thai basil chicken with jasmine rice"
  },
  {
    id: 2,
    name: "Mediterranean Bowl",
    price: 11.99,
    originalPrice: 14.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    category: "mediterranean",
    inStock: true,
    featured: true,
    description: "Fresh Mediterranean vegetables with quinoa and feta"
  },
  {
    id: 3,
    name: "Butter Chicken",
    price: 13.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    category: "indian",
    inStock: true,
    featured: true,
    description: "Creamy tomato-based curry with tender chicken"
  },
  {
    id: 4,
    name: "Beef Bulgogi",
    price: 14.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: false,
    description: "Korean marinated beef with steamed rice"
  },
  {
    id: 5,
    name: "Chicken Tikka Masala",
    price: 12.99,
    originalPrice: 15.99,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
    category: "indian",
    inStock: true,
    featured: true,
    description: "Classic tikka masala with basmati rice"
  },
  {
    id: 6,
    name: "Teriyaki Salmon",
    price: 15.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: false,
    description: "Glazed salmon with teriyaki sauce and vegetables"
  },
  {
    id: 7,
    name: "Pasta Primavera",
    price: 10.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop",
    category: "italian",
    inStock: true,
    featured: false,
    description: "Fresh vegetables with penne in garlic sauce"
  },
  {
    id: 8,
    name: "Mexican Rice Bowl",
    price: 11.99,
    originalPrice: 13.99,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=500&fit=crop",
    category: "mexican",
    inStock: true,
    featured: true,
    description: "Spiced rice with black beans and salsa"
  },
  {
    id: 9,
    name: "Green Curry Shrimp",
    price: 14.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: false,
    description: "Thai green curry with shrimp and vegetables"
  },
  {
    id: 10,
    name: "Chicken Alfredo",
    price: 12.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=500&fit=crop",
    category: "italian",
    inStock: true,
    featured: false,
    description: "Creamy alfredo pasta with grilled chicken"
  },
  {
    id: 11,
    name: "Lamb Biryani",
    price: 15.99,
    originalPrice: 18.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop",
    category: "indian",
    inStock: true,
    featured: true,
    description: "Aromatic spiced rice with tender lamb"
  },
  {
    id: 12,
    name: "Vegetable Stir Fry",
    price: 9.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1543826173-70651703c5a4?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: false,
    description: "Mixed vegetables in savory sauce with rice"
  },
  {
    id: 13,
    name: "BBQ Pulled Pork",
    price: 13.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=500&fit=crop",
    category: "american",
    inStock: false,
    featured: false,
    description: "Smoky pulled pork with coleslaw"
  },
  {
    id: 15,
    name: "Kung Pao Chicken",
    price: 12.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=500&fit=crop",
    category: "asian",
    inStock: true,
    featured: true,
    description: "Spicy chicken with peanuts and vegetables"
  },
  {
    id: 16,
    name: "Mushroom Risotto",
    price: 11.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=500&fit=crop",
    category: "italian",
    inStock: true,
    featured: false,
    description: "Creamy arborio rice with wild mushrooms"
  }
];

export const categories = [
  { id: "all", name: "All Meals" },
  { id: "asian", name: "Asian Cuisine" },
  { id: "indian", name: "Indian Flavors" },
  { id: "mediterranean", name: "Mediterranean" },
  { id: "italian", name: "Italian Classics" },
  { id: "mexican", name: "Mexican Favorites" },
  { id: "american", name: "American Comfort" }
];

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductsByCategory = (category) =>
  category === "all" ? products : products.filter(p => p.category === category);
export const getProductById = (id) => products.find(p => p.id === id);
