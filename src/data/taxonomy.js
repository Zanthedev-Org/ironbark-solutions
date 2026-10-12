// Full taxonomy with Department > Category > Subcategory hierarchy
export const categoryTaxonomy = {};

// ─── Spec schema per category ─────────────────────────────────────────────────
// Each field: { id, label, type: 'text'|'select'|'number', options?, unit?, optional? }
// optional: true  ⟹ field is not required; greyed placeholder shown
export const categorySpecs = {

  // ── Modern Furniture ────────────────────────────────────────────────────────
  'Modern Furniture': [
    { id: 'furnitureType', label: 'Furniture Type', type: 'select', options: ['Living Room Sofa / Sectional', 'Dining Table & Chairs', 'Bed & Bedroom Set', 'Office Desk & Executive Chair', 'TV Console & Wall Unit', 'Coffee Table', 'Wardrobe & Storage'] },
    { id: 'material', label: 'Primary Material', type: 'select', options: ['Genuine Leather', 'Velvet Fabric', 'Solid Hardwood', 'Marble Top', 'Stainless Steel / Metal', 'Engineered Wood / MDF', 'Tempered Glass'] },
    { id: 'seating', label: 'Seating Capacity', type: 'select', options: ['1-Seater / Armchair', '2-Seater Loveseat', '3-Seater Sofa', '4-Seater Dining', '6-Seater Dining', '7-Seater Sectional', '8+ Seater'], optional: true },
    { id: 'dimensions', label: 'Dimensions (L x W x H)', type: 'text', placeholder: 'e.g. 240cm x 95cm x 85cm', optional: true },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Royal Blue, Emerald Green, Grey, Marble White' },
    { id: 'assembly', label: 'Assembly Required', type: 'select', options: ['Pre-Assembled', 'Partial Assembly', 'Free On-Site Installation'], optional: true },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years'], optional: true },
  ],

  // ── Inverters & Solar (Firman Hybrid & ECO-FLOW) ───────────────────────────
  'Inverters & Solar': [
    { id: 'brand', label: 'Brand', type: 'select', options: ['Firman', 'EcoFlow', 'Felicity', 'Luminous', 'Prag', 'Must', 'Growatt'] },
    { id: 'inverterType', label: 'Inverter Type', type: 'select', options: ['Hybrid Solar Inverter', 'Portable Power Station / Battery Generator', 'Pure Sine Wave Inverter', 'Off-Grid Inverter', 'Commercial Three-Phase Inverter'] },
    { id: 'capacity', label: 'Rated Power Capacity', type: 'select', options: ['768Wh / 800W', '1kVA / 1000W', '2.4kVA / 2000W', '3.5kVA / 3000W', '5kVA / 5000W', '7.5kVA / 7000W', '10kVA / 10000W', '15kVA+'] },
    { id: 'systemVoltage', label: 'Battery System Voltage', type: 'select', options: ['12V', '24V', '48V', 'High-Voltage Battery (EcoFlow LFP)'] },
    { id: 'batteryType', label: 'Battery Compatibility', type: 'select', options: ['Built-in LiFePO4 (LFP)', 'External Lithium-ion / LiFePO4', 'Tubular / Gel / Lead Acid', 'Dual Compatibility'] },
    { id: 'solarCharging', label: 'Solar Controller (MPPT)', type: 'select', options: ['Built-in MPPT Solar Controller', 'Dual MPPT', 'PWM Controller', 'External Controller Required'] },
    { id: 'fastCharging', label: 'Fast Charging Tech', type: 'text', placeholder: 'e.g. X-Stream 0-80% in 50 min, AC 220V Fast Charge', optional: true },
    { id: 'appControl', label: 'Smart App / WiFi', type: 'select', options: ['WiFi & Bluetooth App Control', 'LED Display Only', 'RS485 / CAN Port'], optional: true },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years'] },
  ],

  // ── Air Conditioners ────────────────────────────────────────────────────────
  'Air Conditioners': [
    { id: 'acType', label: 'AC Type', type: 'select', options: ['Split Unit AC', 'Floor Standing Package AC', 'Inverter Split AC', 'Cassette Ceiling AC', 'Window Unit AC', 'Portable AC'] },
    { id: 'capacityHp', label: 'Capacity (Horsepower)', type: 'select', options: ['1.0 HP (9,000 BTU)', '1.5 HP (12,000 BTU)', '2.0 HP (18,000 BTU)', '2.5 HP (24,000 BTU)', '3.0 HP (28,000 BTU)', '5.0 HP (48,000 BTU)'] },
    { id: 'inverterTech', label: 'Inverter Technology', type: 'select', options: ['Full Inverter (Low Power / Generator Friendly)', 'Non-Inverter Standard'] },
    { id: 'gasType', label: 'Refrigerant Gas', type: 'select', options: ['R410A Eco-Friendly', 'R32 Ultra-Efficient', 'R22'], optional: true },
    { id: 'copperPipe', label: 'Pipe Material', type: 'select', options: ['100% Pure Copper Condenser & Pipes', 'Aluminum Alloy'], optional: true },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Pure White, Mirror Black, Golden' },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year Comprehensive', '2 Years Compressor', '5 Years Compressor', '10 Years Compressor'] },
  ],

  // ── Freezers ────────────────────────────────────────────────────────────────
  'Freezers': [
    { id: 'freezerType', label: 'Freezer Type', type: 'select', options: ['Chest Deep Freezer (Single Door)', 'Chest Deep Freezer (Double Door)', 'Chest Freezer (Triple Door)', 'Upright / Standing Freezer', 'Commercial Display Freezer'] },
    { id: 'capacityLitres', label: 'Capacity (Litres)', type: 'select', options: ['100L - 150L', '200L - 250L', '300L - 350L', '400L - 450L', '500L - 600L', '700L+ Commercial'] },
    { id: 'inverter', label: 'Inverter Technology', type: 'select', options: ['Inverter Compressor (Low Energy)', 'Standard Compressor'] },
    { id: 'coolRetention', label: 'Cooling Retention (Power Outage)', type: 'select', options: ['Up to 72 Hours', 'Up to 100 Hours', 'Up to 120 Hours', 'Standard 24-48 Hours'], optional: true },
    { id: 'lockKey', label: 'Safety Lock & Key', type: 'select', options: ['Yes', 'No'], optional: true },
    { id: 'innerLining', label: 'Inner Lining', type: 'select', options: ['Embossed Aluminum', 'Galvanized Steel', 'White Coated'], optional: true },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Silver, White, Dark Grey' },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '3 Years Compressor', '5 Years Compressor'] },
  ],

  // ── Refrigerators ───────────────────────────────────────────────────────────
  'Refrigerators': [
    { id: 'fridgeType', label: 'Refrigerator Type', type: 'select', options: ['Double Door (Top Freezer)', 'Double Door (Bottom Freezer)', 'Side-by-Side (French Door)', 'Single Door Compact', 'Beverage Chiller / Showcase Cooler', 'Mini Bar Refrigerator'] },
    { id: 'capacityLitres', label: 'Capacity (Litres)', type: 'select', options: ['Under 150L', '150L - 250L', '260L - 350L', '360L - 480L', '500L - 650L (Side by Side)', '650L+ Multi-Door'] },
    { id: 'defrostType', label: 'Defrost System', type: 'select', options: ['No Frost (Frost Free)', 'Defrost Direct Cooling'] },
    { id: 'dispenser', label: 'Water Dispenser', type: 'select', options: ['Built-in External Dispenser', 'None'], optional: true },
    { id: 'inverter', label: 'Inverter Compressor', type: 'select', options: ['Smart Inverter (Energy Saving A+++)', 'Standard Compressor'] },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Stainless Steel, Dark Titanium, Black Glass, Silver' },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '5 Years Compressor', '10 Years Compressor'] },
  ],

  // ── Washing Machines ────────────────────────────────────────────────────────
  'Washing Machines': [
    { id: 'loadingType', label: 'Loading Type', type: 'select', options: ['Front Load Automatic', 'Top Load Automatic', 'Twin Tub Semi-Automatic', 'Single Tub Manual'] },
    { id: 'function', label: 'Functionality', type: 'select', options: ['Wash & Dry (Combo All-in-One)', 'Wash & Spin (Separate Spin)', 'Wash Only'] },
    { id: 'capacityKg', label: 'Capacity (kg)', type: 'select', options: ['6kg', '7kg', '8kg', '9kg', '10kg', '12kg', '15kg+ Large Capacity'] },
    { id: 'motorType', label: 'Motor Technology', type: 'select', options: ['Inverter Direct Drive (Quiet & Efficient)', 'Smart Inverter Motor', 'Belt Drive Standard'] },
    { id: 'steamWash', label: 'Steam & Allergy Care', type: 'select', options: ['Yes', 'No'], optional: true },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Luxury Silver, Dark Grey, White' },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '5 Years Motor', '10 Years Motor'] },
  ],

  // ── TV & Home Audio ────────────────────────────────────────────────────────
  'Televisions': [
    { id: 'displaySize', label: 'Screen Size', type: 'select', options: ['32"', '43"', '50"', '55"', '65"', '75"', '85"', '98"'] },
    { id: 'resolution', label: 'Resolution', type: 'select', options: ['HD Ready (720p)', 'Full HD (1080p)', '4K UHD', '8K'] },
    { id: 'panel', label: 'Panel Technology', type: 'select', options: ['LED', 'OLED', 'QLED', 'QNED', 'Mini-LED'] },
    { id: 'smartOs', label: 'Smart TV OS', type: 'select', options: ['webOS', 'Tizen', 'Android TV', 'Google TV', 'Vidaa OS'] },
    { id: 'sound', label: 'Sound System', type: 'text', placeholder: 'e.g. 40W Dolby Atmos', optional: true },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years', '3 Years'], optional: true },
  ],

  'Audio': [
    { id: 'type', label: 'Audio Type', type: 'select', options: ['Home Theater System 5.1', 'Soundbar with Wireless Subwoofer', 'Party Tower Speaker', 'Bluetooth Hi-Fi System'] },
    { id: 'connectivity', label: 'Connectivity', type: 'select', options: ['Bluetooth + HDMI ARC + Optical', 'Bluetooth + AUX', 'USB + FM + Bluetooth'] },
    { id: 'power', label: 'Power Output', type: 'text', placeholder: 'e.g. 500W RMS, 1000W PMPO', optional: true },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years'], optional: true },
  ],

  // ── Kitchen & Small Appliances ──────────────────────────────────────────────
  'Small Kitchen Appliances': [
    { id: 'applianceType', label: 'Appliance Type', type: 'select', options: ['Microwave Oven', 'Air Fryer', 'Commercial Blender', 'Water Dispenser', 'Gas Cooker & Oven', 'Yam Pounder / Food Processor'] },
    { id: 'power', label: 'Power (Watts)', type: 'text', placeholder: 'e.g. 1500W, 2000W' },
    { id: 'capacity', label: 'Capacity', type: 'text', placeholder: 'e.g. 20L, 5L, 2.5L Jar', optional: true },
    { id: 'color', label: 'Color / Finish', type: 'text', placeholder: 'e.g. Stainless Steel, Black, Silver' },
    { id: 'warranty', label: 'Warranty', type: 'select', options: ['1 Year', '2 Years'], optional: true },
  ]
};

// Dynamic filter attributes for Shop sidebar
export const categoryAttributes = {
  'Modern Furniture': [
    { id: 'furnitureType', label: 'Furniture Type', options: ['Living Room Sofa / Sectional', 'Dining Table & Chairs', 'Bed & Bedroom Set', 'Office Desk & Executive Chair', 'TV Console & Wall Unit'] },
    { id: 'material', label: 'Material', options: ['Genuine Leather', 'Velvet Fabric', 'Solid Hardwood', 'Marble Top', 'Stainless Steel / Metal'] },
    { id: 'seating', label: 'Seating Capacity', options: ['3-Seater Sofa', '6-Seater Dining', '7-Seater Sectional'] }
  ],
  'Inverters & Solar': [
    { id: 'brand', label: 'Brand', options: ['Firman', 'EcoFlow', 'Felicity', 'Luminous', 'Prag'] },
    { id: 'inverterType', label: 'Inverter Type', options: ['Hybrid Solar Inverter', 'Portable Power Station / Battery Generator', 'Pure Sine Wave Inverter'] },
    { id: 'capacity', label: 'Power Capacity', options: ['768Wh / 800W', '2.4kVA / 2000W', '3.5kVA / 3000W', '5kVA / 5000W', '10kVA / 10000W'] },
    { id: 'systemVoltage', label: 'System Voltage', options: ['12V', '24V', '48V'] }
  ],
  'Air Conditioners': [
    { id: 'acType', label: 'AC Type', options: ['Split Unit AC', 'Floor Standing Package AC', 'Inverter Split AC'] },
    { id: 'capacityHp', label: 'Capacity (HP)', options: ['1.0 HP (9,000 BTU)', '1.5 HP (12,000 BTU)', '2.0 HP (18,000 BTU)', '3.0 HP (28,000 BTU)'] },
    { id: 'inverterTech', label: 'Inverter', options: ['Full Inverter (Low Power)', 'Non-Inverter Standard'] }
  ],
  'Freezers': [
    { id: 'freezerType', label: 'Type', options: ['Chest Deep Freezer (Single Door)', 'Chest Deep Freezer (Double Door)', 'Upright / Standing Freezer'] },
    { id: 'capacityLitres', label: 'Capacity', options: ['150L - 250L', '260L - 350L', '400L - 500L', '600L+'] }
  ],
  'Refrigerators': [
    { id: 'fridgeType', label: 'Type', options: ['Double Door (Top Freezer)', 'Double Door (Bottom Freezer)', 'Side-by-Side (French Door)', 'Single Door Compact'] },
    { id: 'defrostType', label: 'Defrost', options: ['No Frost (Frost Free)', 'Defrost Direct Cooling'] }
  ],
  'Washing Machines': [
    { id: 'loadingType', label: 'Loading Type', options: ['Front Load Automatic', 'Top Load Automatic', 'Twin Tub Semi-Automatic'] },
    { id: 'function', label: 'Function', options: ['Wash & Dry (Combo)', 'Wash & Spin'] },
    { id: 'capacityKg', label: 'Capacity (kg)', options: ['7kg', '8kg', '9kg', '10kg', '12kg'] }
  ],
  'Televisions': [
    { id: 'displaySize', label: 'Screen Size', options: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'] },
    { id: 'resolution', label: 'Resolution', options: ['1080p Full HD', '4K UHD'] },
    { id: 'panel', label: 'Panel Technology', options: ['LED', 'OLED', 'QLED', 'QNED'] }
  ]
};

// Fallback filters for categories without deeply defined attributes
export const defaultAttributes = [
  { id: 'condition', label: 'Condition', options: ['Brand New', '100% Genuine Guaranteed'] },
  { id: 'warranty', label: 'Warranty', options: ['1 Year', '2 Years', '3 Years', '5 Years'] }
];
