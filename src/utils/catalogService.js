import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export const DEFAULT_CATEGORIES = [];

export const DEFAULT_BRANDS = [
  { name: 'Firman',           order: 0 },
  { name: 'EcoFlow',          order: 1 },
  { name: 'Hisense',          order: 2 },
  { name: 'LG',               order: 3 },
  { name: 'Samsung',          order: 4 },
  { name: 'Haier Thermocool', order: 5 },
  { name: 'Midea',            order: 6 },
  { name: 'Scanfrost',        order: 7 },
  { name: 'Royal',            order: 8 },
  { name: 'TCL',              order: 9 },
  { name: 'Sony',             order: 10 },
  { name: 'Modern Living',    order: 11 },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const categoriesRef = () => collection(db, 'categories');

export function listenToCategories(callback) {
  const q = query(categoriesRef(), orderBy('order', 'asc'));
  return onSnapshot(q, snap => {
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fetchedNames = fetched.map(c => c.name.toLowerCase());
    const defaults = DEFAULT_CATEGORIES.filter(c => !fetchedNames.includes(c.name.toLowerCase()));
    const merged = [...defaults, ...fetched].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    callback(merged);
  });
}

export async function addCategory(data) {
  return addDoc(categoriesRef(), { ...data, createdAt: new Date() });
}

export async function updateCategory(id, data) {
  return updateDoc(doc(db, 'categories', id), data);
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, 'categories', id));
}

export async function seedTaxonomy() {
  const data = [
    // 1. Modern Furniture
    { type: 'department', department: 'Modern Furniture', name: 'Modern Furniture', order: 1 },
    { type: 'category', department: 'Modern Furniture', category: 'Living Room Furniture', name: 'Living Room Furniture', order: 1 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Living Room Furniture', subcategory: 'Sectional & Sofa Sets', name: 'Sectional & Sofa Sets', order: 1 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Living Room Furniture', subcategory: 'TV Consoles & Wall Units', name: 'TV Consoles & Wall Units', order: 2 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Living Room Furniture', subcategory: 'Coffee & Side Tables', name: 'Coffee & Side Tables', order: 3 },
    { type: 'category', department: 'Modern Furniture', category: 'Dining Room', name: 'Dining Room', order: 2 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Dining Room', subcategory: 'Marble Dining Sets', name: 'Marble Dining Sets', order: 1 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Dining Room', subcategory: 'Wooden Dining Sets', name: 'Wooden Dining Sets', order: 2 },
    { type: 'category', department: 'Modern Furniture', category: 'Office & Executive Furniture', name: 'Office & Executive Furniture', order: 3 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Office & Executive Furniture', subcategory: 'Executive Desks', name: 'Executive Desks', order: 1 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Office & Executive Furniture', subcategory: 'Ergonomic High-Back Chairs', name: 'Ergonomic High-Back Chairs', order: 2 },
    { type: 'category', department: 'Modern Furniture', category: 'Bedroom Furniture', name: 'Bedroom Furniture', order: 4 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Bedroom Furniture', subcategory: 'Luxury Beds & Frames', name: 'Luxury Beds & Frames', order: 1 },
    { type: 'subcategory', department: 'Modern Furniture', category: 'Bedroom Furniture', subcategory: 'Wardrobes & Dressing Tables', name: 'Wardrobes & Dressing Tables', order: 2 },

    // 2. Inverters & Solar (Firman & EcoFlow)
    { type: 'department', department: 'Inverters & Solar', name: 'Inverters & Solar', order: 2 },
    { type: 'category', department: 'Inverters & Solar', category: 'Firman Hybrid Inverters', name: 'Firman Hybrid Inverters', order: 1 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Firman Hybrid Inverters', subcategory: 'Firman 3.5kVA / 24V Inverter', name: 'Firman 3.5kVA / 24V Inverter', order: 1 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Firman Hybrid Inverters', subcategory: 'Firman 5kVA / 48V Inverter', name: 'Firman 5kVA / 48V Inverter', order: 2 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Firman Hybrid Inverters', subcategory: 'Firman 10kVA Commercial Inverter', name: 'Firman 10kVA Commercial Inverter', order: 3 },
    { type: 'category', department: 'Inverters & Solar', category: 'ECO-FLOW INVERTERS', name: 'ECO-FLOW INVERTERS', order: 2 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'ECO-FLOW INVERTERS', subcategory: 'EcoFlow River Series', name: 'EcoFlow River Series', order: 1 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'ECO-FLOW INVERTERS', subcategory: 'EcoFlow DELTA 2 Max', name: 'EcoFlow DELTA 2 Max', order: 2 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'ECO-FLOW INVERTERS', subcategory: 'EcoFlow DELTA Pro 3600W', name: 'EcoFlow DELTA Pro 3600W', order: 3 },
    { type: 'category', department: 'Inverters & Solar', category: 'Batteries & Solar Panels', name: 'Batteries & Solar Panels', order: 3 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Batteries & Solar Panels', subcategory: 'Lithium LiFePO4 Batteries', name: 'Lithium LiFePO4 Batteries', order: 1 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Batteries & Solar Panels', subcategory: 'Tubular Gel Batteries', name: 'Tubular Gel Batteries', order: 2 },
    { type: 'subcategory', department: 'Inverters & Solar', category: 'Batteries & Solar Panels', subcategory: 'Mono-Crystalline Solar Panels', name: 'Mono-Crystalline Solar Panels', order: 3 },

    // 3. Air Conditioners
    { type: 'department', department: 'Air Conditioners', name: 'Air Conditioners', order: 3 },
    { type: 'category', department: 'Air Conditioners', category: 'Split Inverter AC', name: 'Split Inverter AC', order: 1 },
    { type: 'subcategory', department: 'Air Conditioners', category: 'Split Inverter AC', subcategory: '1.0 HP Split AC', name: '1.0 HP Split AC', order: 1 },
    { type: 'subcategory', department: 'Air Conditioners', category: 'Split Inverter AC', subcategory: '1.5 HP Split AC', name: '1.5 HP Split AC', order: 2 },
    { type: 'subcategory', department: 'Air Conditioners', category: 'Split Inverter AC', subcategory: '2.0 HP Split AC', name: '2.0 HP Split AC', order: 3 },
    { type: 'category', department: 'Air Conditioners', category: 'Floor Standing Package AC', name: 'Floor Standing Package AC', order: 2 },
    { type: 'subcategory', department: 'Air Conditioners', category: 'Floor Standing Package AC', subcategory: '2.0 HP - 3.0 HP Standing AC', name: '2.0 HP - 3.0 HP Standing AC', order: 1 },
    { type: 'subcategory', department: 'Air Conditioners', category: 'Floor Standing Package AC', subcategory: '5.0 HP - 10 HP Commercial AC', name: '5.0 HP - 10 HP Commercial AC', order: 2 },
    { type: 'category', department: 'Air Conditioners', category: 'Cassette & Ceiling AC', name: 'Cassette & Ceiling AC', order: 3 },

    // 4. Freezers
    { type: 'department', department: 'Freezers', name: 'Freezers', order: 4 },
    { type: 'category', department: 'Freezers', category: 'Chest Deep Freezers', name: 'Chest Deep Freezers', order: 1 },
    { type: 'subcategory', department: 'Freezers', category: 'Chest Deep Freezers', subcategory: 'Single Door Chest Freezers', name: 'Single Door Chest Freezers', order: 1 },
    { type: 'subcategory', department: 'Freezers', category: 'Chest Deep Freezers', subcategory: 'Double Door Chest Freezers', name: 'Double Door Chest Freezers', order: 2 },
    { type: 'subcategory', department: 'Freezers', category: 'Chest Deep Freezers', subcategory: 'Inverter Fast-Freeze Freezers', name: 'Inverter Fast-Freeze Freezers', order: 3 },
    { type: 'category', department: 'Freezers', category: 'Standing Upright Freezers', name: 'Standing Upright Freezers', order: 2 },

    // 5. Refrigerators
    { type: 'department', department: 'Refrigerators', name: 'Refrigerators', order: 5 },
    { type: 'category', department: 'Refrigerators', category: 'Double Door Refrigerators', name: 'Double Door Refrigerators', order: 1 },
    { type: 'subcategory', department: 'Refrigerators', category: 'Double Door Refrigerators', subcategory: 'Top Freezer Double Door', name: 'Top Freezer Double Door', order: 1 },
    { type: 'subcategory', department: 'Refrigerators', category: 'Double Door Refrigerators', subcategory: 'Bottom Freezer Double Door', name: 'Bottom Freezer Double Door', order: 2 },
    { type: 'category', department: 'Refrigerators', category: 'Side-by-Side & French Door', name: 'Side-by-Side & French Door', order: 2 },
    { type: 'subcategory', department: 'Refrigerators', category: 'Side-by-Side & French Door', subcategory: 'With Water Dispenser', name: 'With Water Dispenser', order: 1 },
    { type: 'subcategory', department: 'Refrigerators', category: 'Side-by-Side & French Door', subcategory: 'Four-Door French Refrigerators', name: 'Four-Door French Refrigerators', order: 2 },
    { type: 'category', department: 'Refrigerators', category: 'Single Door & Compact', name: 'Single Door & Compact', order: 3 },
    { type: 'category', department: 'Refrigerators', category: 'Showcase & Beverage Chillers', name: 'Showcase & Beverage Chillers', order: 4 },

    // 6. Washing Machines
    { type: 'department', department: 'Washing Machines', name: 'Washing Machines', order: 6 },
    { type: 'category', department: 'Washing Machines', category: 'Front Load Automatic', name: 'Front Load Automatic', order: 1 },
    { type: 'subcategory', department: 'Washing Machines', category: 'Front Load Automatic', subcategory: 'Front Load Wash & Dry', name: 'Front Load Wash & Dry', order: 1 },
    { type: 'subcategory', department: 'Washing Machines', category: 'Front Load Automatic', subcategory: 'Front Load Wash & Spin', name: 'Front Load Wash & Spin', order: 2 },
    { type: 'category', department: 'Washing Machines', category: 'Top Loader Automatic', name: 'Top Loader Automatic', order: 2 },
    { type: 'category', department: 'Washing Machines', category: 'Twin Tub Semi-Automatic', name: 'Twin Tub Semi-Automatic', order: 3 },
    { type: 'category', department: 'Washing Machines', category: 'Single Tub Manual', name: 'Single Tub Manual', order: 4 },

    // 7. Televisions & Home Audio
    { type: 'department', department: 'Televisions & Home Audio', name: 'Televisions & Home Audio', order: 7 },
    { type: 'category', department: 'Televisions & Home Audio', category: 'Televisions', name: 'Televisions', order: 1 },
    { type: 'subcategory', department: 'Televisions & Home Audio', category: 'Televisions', subcategory: '32" - 43" Smart TVs', name: '32" - 43" Smart TVs', order: 1 },
    { type: 'subcategory', department: 'Televisions & Home Audio', category: 'Televisions', subcategory: '50" - 65" 4K UHD Smart TVs', name: '50" - 65" 4K UHD Smart TVs', order: 2 },
    { type: 'subcategory', department: 'Televisions & Home Audio', category: 'Televisions', subcategory: '75" - 98" Large Screen & OLED', name: '75" - 98" Large Screen & OLED', order: 3 },
    { type: 'category', department: 'Televisions & Home Audio', category: 'Audio & Home Theaters', name: 'Audio & Home Theaters', order: 2 },
    { type: 'subcategory', department: 'Televisions & Home Audio', category: 'Audio & Home Theaters', subcategory: 'Home Theater 5.1 Systems', name: 'Home Theater 5.1 Systems', order: 1 },
    { type: 'subcategory', department: 'Televisions & Home Audio', category: 'Audio & Home Theaters', subcategory: 'Soundbars & Bluetooth Speakers', name: 'Soundbars & Bluetooth Speakers', order: 2 },

    // 8. Kitchen & Home Appliances
    { type: 'department', department: 'Kitchen & Home Appliances', name: 'Kitchen & Home Appliances', order: 8 },
    { type: 'category', department: 'Kitchen & Home Appliances', category: 'Cooking Appliances', name: 'Cooking Appliances', order: 1 },
    { type: 'subcategory', department: 'Kitchen & Home Appliances', category: 'Cooking Appliances', subcategory: 'Gas Cookers & Standing Ovens', name: 'Gas Cookers & Standing Ovens', order: 1 },
    { type: 'subcategory', department: 'Kitchen & Home Appliances', category: 'Cooking Appliances', subcategory: 'Microwave Ovens', name: 'Microwave Ovens', order: 2 },
    { type: 'subcategory', department: 'Kitchen & Home Appliances', category: 'Cooking Appliances', subcategory: 'Air Fryers', name: 'Air Fryers', order: 3 },
    { type: 'category', department: 'Kitchen & Home Appliances', category: 'Small Appliances', name: 'Small Appliances', order: 2 },
    { type: 'subcategory', department: 'Kitchen & Home Appliances', category: 'Small Appliances', subcategory: 'Heavy-Duty Blenders', name: 'Heavy-Duty Blenders', order: 1 },
    { type: 'subcategory', department: 'Kitchen & Home Appliances', category: 'Small Appliances', subcategory: 'Water Dispensers', name: 'Water Dispensers', order: 2 },
  ];

  for (const item of data) {
    await addCategory(item);
  }
}

// ─── BRANDS ──────────────────────────────────────────────────────────────────
const brandsRef = () => collection(db, 'brands');

export function listenToBrands(callback) {
  const q = query(brandsRef(), orderBy('order', 'asc'));
  return onSnapshot(q, snap => {
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fetchedNames = fetched.map(b => b.name.toLowerCase());
    const defaults = DEFAULT_BRANDS.filter(b => !fetchedNames.includes(b.name.toLowerCase()));
    const merged = [...defaults, ...fetched].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    callback(merged);
  });
}

export async function addBrand(data) {
  return addDoc(brandsRef(), { ...data, createdAt: new Date() });
}

export async function updateBrand(id, data) {
  return updateDoc(doc(db, 'brands', id), data);
}

export async function deleteBrand(id) {
  return deleteDoc(doc(db, 'brands', id));
}
