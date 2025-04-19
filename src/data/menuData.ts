
import { MenuItem, MenuCategory } from '@/types';

export const menuCategories: MenuCategory[] = [
  { id: 'chaap-tikkas', name: 'chaap-tikkas', displayName: 'Chaap Tikkas' },
  { id: 'chapp-tikkas', name: 'chapp-tikkas', displayName: 'Chappp Tikkas' },
  { id: 'lassi', name: 'lassi', displayName: 'Lassi' },
  { id: 'momos-rolls', name: 'momos-rolls', displayName: 'Momos & Rolls' },
  { id: 'rice', name: 'rice', displayName: 'Rice' },
  { id: 'raita', name: 'raita', displayName: 'Raita' },
  { id: 'papad', name: 'papad', displayName: 'Papad' },
  { id: 'breads', name: 'breads', displayName: 'Breads' },
  { id: 'salad', name: 'salad', displayName: 'Salad' },
  { id: 'burgers', name: 'burgers', displayName: 'Burgers' },
  { id: 'garlic-bread', name: 'garlic-bread', displayName: 'Garlic Bread' },
  { id: 'pizza', name: 'pizza', displayName: 'Pizza' },
  { id: 'wraps', name: 'wraps', displayName: 'Wraps' },
  { id: 'chinese', name: 'chinese', displayName: 'Chinese' },
  { id: 'south-indian', name: 'south-indian', displayName: 'South Indian' },
  { id: 'sandwich', name: 'sandwich', displayName: 'Sandwich' },
  { id: 'maggi', name: 'maggi', displayName: 'Maggi' },
  { id: 'fries', name: 'fries', displayName: 'Fries' },
  { id: 'noodle-rice', name: 'noodle-rice', displayName: 'Noodle & Rice' },
  { id: 'pasta', name: 'pasta', displayName: 'Pasta' },
  { id: 'salad', name: 'salad', displayName: 'Salad' },
  { id: 'soup', name: 'soup', displayName: 'Soup' },
  { id: 'momos', name: 'momos', displayName: 'Momos' },
  { id: 'ice-cream', name: 'ice-cream', displayName: 'Ice Cream' },
  { id: 'mockail', name: 'mockail', displayName: 'Mocktail' },
  { id: 'tea', name: 'tea', displayName: 'Tea' },
  { id: 'addons', name: 'addons', displayName: 'Add-ons' },
  { id: 'shakes-coffee', name: 'shakes-coffee', displayName: 'Shakes & Coffee' },
  { id: 'protein', name: 'protein', displayName: 'Protein Items' },
  { id: 'combo', name: 'combo', displayName: 'Combo Offer' },
];

export const menuItems: MenuItem[] = [
  // Chaap Tikkas
  {
    id: 'tandoori-chaap-tikka',
    name: 'Tandoori Chaap Tikka',
    price: { half: 130, full: 200 },
    category: 'chaap-tikkas',
  },
  {
    id: 'masala-chaap-tikka',
    name: 'Masala Chaap Tikka',
    price: { half: 120, full: 180 },
    category: 'chaap-tikkas',
  },
  {
    id: 'lemon-chaap-tikka',
    name: 'Lemon Chaap Tikka',
    price: { half: 120, full: 180 },
    category: 'chaap-tikkas',
  },
  {
    id: 'afghani-chaap-tikka',
    name: 'Afghani Chaap Tikka',
    price: { half: 130, full: 200 },
    category: 'chaap-tikkas',
  },
  {
    id: 'haryali-chaap-tikka',
    name: 'Haryali Chaap Tikka',
    price: { half: 120, full: 180 },
    category: 'chaap-tikkas',
  },
  {
    id: 'malai-chaap-tikka',
    name: 'Malai Chaap Tikka',
    price: { half: 140, full: 210 },
    category: 'chaap-tikkas',
  },
  {
    id: 'achari-chaap-tikka',
    name: 'Achari Chaap Tikka',
    price: { half: 140, full: 210 },
    category: 'chaap-tikkas',
  },
  {
    id: 'kurkuri-chaap',
    name: 'Kurkuri Chaap',
    price: { half: 140, full: 210 },
    category: 'chaap-tikkas',
  },
  {
    id: 'mushroom-tikka',
    name: 'Mushroom Tikka',
    price: 210,
    category: 'chaap-tikkas',
  },
  {
    id: 'tandoori-paneer-tikka',
    name: 'Tandoori Paneer Tikka',
    price: { half: 130, full: 200 },
    category: 'chaap-tikkas',
  },
  {
    id: 'afghani-paneer-tikka',
    name: 'Afghani Paneer Tikka',
    price: { half: 130, full: 200 },
    category: 'chaap-tikkas',
  },
  {
    id: 'malai-paneer-tikka',
    name: 'Malai Paneer Tikka',
    price: { half: 140, full: 210 },
    category: 'chaap-tikkas',
  },
  {
    id: 'veg-hh-tandoori-plater',
    name: 'VEG. HH TANDOORI PLATER (PANEER+MUSHROOM+CHAAP+SALAD)',
    price: 300,
    category: 'chaap-tikkas',
    popular: true,
  },

  // Chappp Tikkas
  {
    id: 'dal-fry',
    name: 'Dal Fry',
    price: { half: 100, full: 150 },
    category: 'chapp-tikkas',
  },
  {
    id: 'jeera-aloo',
    name: 'Jeera Aloo',
    price: { half: 100, full: 150 },
    category: 'chapp-tikkas',
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    price: { half: 140, full: 210 },
    category: 'chapp-tikkas',
  },
  {
    id: 'mix-veg',
    name: 'Mix Veg.',
    price: { half: 140, full: 210 },
    category: 'chapp-tikkas',
  },
  {
    id: 'chana-masala',
    name: 'Chana Masala',
    price: { half: 140, full: 210 },
    category: 'chapp-tikkas',
  },
  {
    id: 'malai-kofta',
    name: 'Malai Kofta',
    price: { half: 160, full: 240 },
    category: 'chapp-tikkas',
  },
  {
    id: 'matar-mushroom',
    name: 'Matar Mushroom',
    price: { half: 140, full: 210 },
    category: 'chapp-tikkas',
  },
  {
    id: 'mushroom-marwadi',
    name: 'Mushroom Marwadi',
    price: { half: 150, full: 230 },
    category: 'chapp-tikkas',
  },
  {
    id: 'tawa-mushroom',
    name: 'Tawa Mushroom',
    price: { half: 160, full: 240 },
    category: 'chapp-tikkas',
  },
  {
    id: 'matar-paneer',
    name: 'Matar Paneer',
    price: { half: 150, full: 230 },
    category: 'chapp-tikkas',
  },
  {
    id: 'kadai-paneer',
    name: 'Kadai Paneer',
    price: { half: 150, full: 230 },
    category: 'chapp-tikkas',
  },
  {
    id: 'shahi-paneer',
    name: 'Shahi Paneer',
    price: { half: 160, full: 240 },
    category: 'chapp-tikkas',
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    price: { half: 160, full: 240 },
    category: 'chapp-tikkas',
  },

  // Lassi
  {
    id: 'sweet-lassi',
    name: 'Sweet Lassi',
    price: 80,
    category: 'lassi',
  },
  {
    id: 'salted-lassi',
    name: 'Salted Lassi',
    price: 80,
    category: 'lassi',
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    price: 100,
    category: 'lassi',
  },

  // Burgers
  {
    id: 'aloo-tikki-burger',
    name: 'Aloo Tikki Burger',
    price: 45,
    category: 'burgers',
    description: 'aloo tikki, onion, sauces',
  },
  {
    id: 'aloo-tikki-cheese-burger',
    name: 'Aloo Tikki Cheese Burger',
    price: 50,
    category: 'burgers',
    description: 'aloo tikki, onion, cheese slice, sauces',
  },
  {
    id: 'achari-aloo-tikki-cheese-burger',
    name: 'Achari Aloo-Tikki Cheese Burger',
    price: 55,
    category: 'burgers',
    description: 'aloo tikki, onion, cheese slice, sauces',
  },
  {
    id: 'veg-cheese-burger',
    name: 'Veg. Cheese Burger',
    price: 60,
    category: 'burgers',
    description: 'mix veg. patty, onion, tomato, cheese slice, sauces',
  },
  {
    id: 'masala-tandoori-cheesy-burger',
    name: 'Masala Tandoori Cheesy Burger',
    price: 70,
    category: 'burgers',
    description: 'mix veg. patty, onion, tomato, cheese slice, sauces',
  },
  {
    id: 'mexican-cheesy-burger',
    name: 'Mexican Cheesy Burger',
    price: 70,
    category: 'burgers',
    description: 'herb chili patty, onion, tomato, cheese slice, sauces',
  },
  {
    id: 'tadkta-bhadkta-cheesy-burger',
    name: 'Tadkta Bhadkta Cheesy Burger',
    price: 100,
    category: 'burgers',
    description: 'mix veg. patty, onion, tomato, cheese slice, paneer, sauces',
  },
  {
    id: 'double-decker-cheesy-burger',
    name: 'Double Decker Cheesy Burger',
    price: 100,
    category: 'burgers',
    description: 'aloo tikki, herb chili patty, onion, tomato, cheese slice, sauces',
    popular: true,
  },
  {
    id: 'kurkure-burger',
    name: 'Kurkure Burger',
    price: 120,
    category: 'burgers',
    description: 'mix veg. patty, onion capsicum, paneer, mozerella cheese, sauces',
    popular: true,
  },

  // Garlic Bread
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    price: 100,
    category: 'garlic-bread',
  },
  {
    id: 'stuffed-garlic-bread',
    name: 'Stuffed Garlic Bread',
    price: 120,
    category: 'garlic-bread',
  },

  // Pizza
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Only Cheese',
    price: { half: 80, full: 120 },
    category: 'pizza',
    popular: true,
  },
  {
    id: 'single-topping-pizza',
    name: 'Single Topping Pizza',
    description: 'Choose Any 1 (Onion/Capsicum/Tomato/Sweet Corn)',
    price: { half: 90, full: 135 },
    category: 'pizza',
  },
  {
    id: 'farm-house-pizza',
    name: 'Farm House Pizza',
    description: 'Onion, Capsicum, Tomato',
    price: { half: 110, full: 165 },
    category: 'pizza',
  },
  {
    id: 'tadkta-bhadkta-pizza',
    name: 'Tadkta Bhadkta Pizza',
    description: 'Onion, Bell Pepper, Tomato, Marinated Paneer',
    price: { half: 140, full: 210 },
    category: 'pizza',
  },
  {
    id: 'tickle-pickle-achari-pizza',
    name: 'Tickle-Pickle Achari Pizza',
    description: 'Onion, Bell Pepper, Tomato, Sweet Corn, Jalapeno',
    price: { half: 140, full: 210 },
    category: 'pizza',
  },

  // Momos & Rolls
  {
    id: 'veg-tandoori-momo',
    name: 'Veg. Tandoori Momo',
    price: 140,
    category: 'momos-rolls',
  },
  {
    id: 'veg-afghani-momo',
    name: 'Veg. Afghani Momo',
    price: 160,
    category: 'momos-rolls',
  },
  {
    id: 'paneer-tandoori-momo',
    name: 'Paneer Tandoori Momo',
    price: 160,
    category: 'momos-rolls',
  },
  {
    id: 'paneer-afghani-momo',
    name: 'Paneer Afghani Momo',
    price: 180,
    category: 'momos-rolls',
  },
  {
    id: 'tandoori-spring-roll',
    name: 'Tandoori Spring Roll',
    price: 140,
    category: 'momos-rolls',
  },
];

// Function to get menu items by category
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === category);
};

// Function to get popular menu items
export const getPopularMenuItems = (): MenuItem[] => {
  return menuItems.filter((item) => item.popular);
};

// Function to get all categories
export const getAllCategories = (): string[] => {
  return [...new Set(menuItems.map((item) => item.category))];
};
