export const products = [
  {
    id: 1,
    name: "Grilled Chicken with Vegetables",
    price: 8.00,
    originalPrice: 12.00,
    image: "/5/grilled chick ith vegtibals.png",
    category: "health",
    inStock: true,
    featured: true,
    description: "Ready to Eat & Long shelf life - Grilled chicken with nutritious vegetables"
  },
  {
    id: 3,
    name: "White Beans with Meat and Tomatoes",
    price: 8.00,
    originalPrice: null,
    image: "/5/hite beans ith meat and tomatoas and rice 1ss.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "White beans with meat and tomatoes - healthy dish rich in protein"
  },
  {
    id: 4,
    name: "Kofta with Rice & Sauce",
    price: 8.00,
    originalPrice: null,
    image: "/5/kofta ith sauce.png",
    category: "health",
    inStock: true,
    featured: true,
    description: "Seasoned kofta cooked in rich sauce with vegetables and natural spices"
  },
  {
    id: 5,
    name: "Pasta with Meatballs",
    price: 8.00,
    originalPrice: null,
    image: "/5/pasta ith metaballs meatballs.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Al dente pasta with tender protein-rich meatballs and fresh tomato sauce"
  },
  {
    id: 7,
    name: "Stuffed Zucchini & Grape Leaves with Lamb Ribs",
    price: 8.00,
    originalPrice: null,
    image: "/5/stuffed zucchini and grape leaves ith lamb ribss.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Stuffed zucchini and grape leaves with minced meat, rice and lamb ribs"
  },
  {
    id: 8,
    name: "Zero-Oil Grilled Chicken & Rice",
    price: 8.00,
    originalPrice: null,
    image: "/5/zero oil grilled chicken and ricee.jpg",
    category: "health",
    inStock: true,
    featured: false,
    description: "Ready to Eat & Long shelf life - Healthy zero-oil grilled chicken with brown rice"
  },
  {
    id: 9,
    name: "Zero-Oil Grilled Vegetables, Chicken & Rice",
    price: 8.00,
    originalPrice: 12.00,
    image: "/5/zero oil grilled vegetables chicken ricee.jpg",
    category: "health",
    inStock: true,
    featured: true,
    description: "Ready to Eat & Long shelf life - Zero-oil grilled chicken and vegetables with rice"
  }
];

export const categories = [
  { id: "all", name: "All Meals" },
  { id: "health", name: "Healthy Meals" },
  { id: "sport", name: "Sport" },
  { id: "emergency", name: "Emergency" },
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
