export const products = [
  {
    id: 1,
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
    id: 4,
    name: "Re-Protein",
    price: 8.00,
    originalPrice: null,
    image: "/food/mainone.jpg",
    category: "health",
    inStock: true,
    featured: true,
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
