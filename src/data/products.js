export const products = [
  {
    id: 1,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Premium collagen formula for good health"
  },
  {
    id: 2,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 3,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Premium collagen formula for good health"
  },
  {
    id: 4,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 5,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Premium collagen formula for good health"
  },
  {
    id: 6,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 7,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "Premium collagen formula for good health"
  },
  {
    id: 8,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 9,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "Premium collagen formula for good health"
  },
  {
    id: 10,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 11,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Premium collagen formula for good health"
  },
  {
    id: 12,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 13,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "Premium collagen formula for good health"
  },
  {
    id: 14,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "High-quality protein blend for optimal nutrition"
  },
  {
    id: 15,
    name: "Re-Collagen",
    price: 12.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Premium collagen formula for good health"
  },
  {
    id: 16,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "High-quality protein blend for optimal nutrition"
  }
];

export const categories = [
  { id: "all", name: "All Meals" },
  { id: "asian", name: "Asian Cuisine" },
  { id: "indian", name: "Indian Flavors" },
  { id: "mediterranean", name: "Mediterranean" },
  { id: "italian", name: "Italian Classics" },
  { id: "mexican", name: "Mexican Favorites" },
  { id: "american", name: "American Comfort" },
  { id: "dessert", name: "Desserts" }
];

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductsByCategory = (category) =>
  category === "all" ? products : products.filter(p => p.category === category);
export const getProductById = (id) => products.find(p => p.id === id);
