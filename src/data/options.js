export const BUILDING_USE_OPTIONS = [
  {
    id: 'barn',
    label: 'Barn / Agricultural',
    description: 'Storage for equipment, hay, livestock, and farm operations',
    icon: '🏚',
  },
  {
    id: 'barndominium',
    label: 'Barndominium / Metal House',
    description: 'Residential living space combined with shop or garage',
    icon: '🏠',
  },
  {
    id: 'storage',
    label: 'Storage / Warehouse',
    description: 'General storage, distribution, or light industrial use',
    icon: '🏭',
  },
  {
    id: 'commercial',
    label: 'Church / Commercial',
    description: 'Assembly space, retail, offices, or house of worship',
    icon: '⛪',
  },
  {
    id: 'pavilion',
    label: 'Pavilion / Garage',
    description: 'Vehicle storage, covered outdoor space, or hobby shop',
    icon: '🚗',
  },
];

export const ROOF_STYLE_OPTIONS = [
  {
    id: 'gambrel',
    label: 'Gambrel',
    description: 'Classic barn-style profile with two slopes on each side',
    multiplier: 1.2,
  },
  {
    id: 'single_slope',
    label: 'Single Slope',
    description: 'Modern one-direction pitch for a clean, contemporary look',
    multiplier: 0.95,
  },
  {
    id: 'gable',
    label: 'Gable',
    description: 'Traditional peaked roof — the most common metal building style',
    multiplier: 1.0,
  },
  {
    id: 'mansard',
    label: 'Mansard',
    description: 'High-sided roof for added headroom and usable upper space',
    multiplier: 1.25,
  },
];

export const INSULATION_OPTIONS = [
  {
    id: 'none',
    label: 'None',
    description: 'No insulation — most economical base option',
    adder: 0,
    thermal: null,
  },
  {
    id: 'basic',
    label: 'Basic (2")',
    description: 'Minimal thermal separation, suitable for mild climates',
    adder: 500,
    thermal: 'Low thermal performance',
  },
  {
    id: 'standard',
    label: 'Standard (4")',
    description: 'Good year-round comfort for most applications',
    adder: 1200,
    thermal: 'Moderate thermal performance',
  },
  {
    id: 'premium',
    label: 'Premium (6")',
    description: 'Maximum energy efficiency and interior climate control',
    adder: 2200,
    thermal: 'High thermal performance',
  },
];

export const FINISH_OPTIONS = [
  { id: 'galvalume',      label: 'Galvalume',      hex: '#C0C0C0', swatch: 'bg-zinc-300' },
  { id: 'burnished_slate', label: 'Burnished Slate', hex: '#5C6168', swatch: 'bg-slate-500' },
  { id: 'rustic_red',     label: 'Rustic Red',      hex: '#8B2020', swatch: 'bg-red-800' },
  { id: 'colonial_blue',  label: 'Colonial Blue',   hex: '#2E4A6E', swatch: 'bg-blue-900' },
  { id: 'charcoal_gray',  label: 'Charcoal Gray',   hex: '#3A3D42', swatch: 'bg-gray-700' },
  { id: 'evergreen',      label: 'Evergreen',       hex: '#2D4A30', swatch: 'bg-green-900' },
];

export const STEPS = [
  { id: 1, label: 'Building Use' },
  { id: 2, label: 'Dimensions' },
  { id: 3, label: 'Roof Style' },
  { id: 4, label: 'Doors & Windows' },
  { id: 5, label: 'Insulation' },
  { id: 6, label: 'Finish' },
  { id: 7, label: 'Lead Info' },
  { id: 8, label: 'Estimate' },
];

export const DIMENSION_CONSTRAINTS = {
  width:  { min: 12, max: 200 },
  length: { min: 12, max: 400 },
  height: { min: 8,  max: 30  },
};

export const OPENINGS_CONSTRAINTS = {
  walkDoors:   { min: 0, max: 4 },
  rollUpDoors: { min: 0, max: 4 },
  windows:     { min: 0, max: 8 },
};
