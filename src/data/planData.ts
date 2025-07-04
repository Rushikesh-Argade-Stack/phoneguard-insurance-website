export interface InsurancePlan {
  id: string;
  brand: string;
  model: string;
  name: string;
  premiumPerMonth: number;
  deductible: number;
  features: {
    theft: boolean;
    screenRepair: boolean;
    waterDamage: boolean;
    upgradeOption: boolean;
  };
}

export const insurancePlans: InsurancePlan[] = [
  // Apple iPhone 15 Pro Max
  {
    id: 'plan-1-iphone15promax',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    name: 'Basic Cover',
    premiumPerMonth: 15.99,
    deductible: 99,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: false,
      upgradeOption: false
    }
  },
  {
    id: 'plan-2-iphone15promax',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    name: 'Premium Protection',
    premiumPerMonth: 29.99,
    deductible: 49,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: true,
      upgradeOption: true
    }
  },
  // Samsung Galaxy S24 Ultra
  {
    id: 'plan-3-galaxys24ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    name: 'Essential Plan',
    premiumPerMonth: 18.50,
    deductible: 120,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: false,
      upgradeOption: false
    }
  },
  {
    id: 'plan-4-galaxys24ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    name: 'Ultimate Coverage',
    premiumPerMonth: 32.00,
    deductible: 60,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: true,
      upgradeOption: true
    }
  },
  // Google Pixel 8 Pro
  {
    id: 'plan-5-pixel8pro',
    brand: 'Google Pixel',
    model: 'Pixel 8 Pro',
    name: 'Standard Protection',
    premiumPerMonth: 16.99,
    deductible: 89,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: false,
      upgradeOption: false
    }
  },
  {
    id: 'plan-6-pixel8pro',
    brand: 'Google Pixel',
    model: 'Pixel 8 Pro',
    name: 'Complete Care',
    premiumPerMonth: 27.99,
    deductible: 59,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: true,
      upgradeOption: true
    }
  },
  // OnePlus 12
  {
    id: 'plan-7-oneplus12',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    name: 'Basic Shield',
    premiumPerMonth: 14.99,
    deductible: 95,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: false,
      upgradeOption: false
    }
  },
  {
    id: 'plan-8-oneplus12',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    name: 'Premium Shield',
    premiumPerMonth: 24.99,
    deductible: 55,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: true,
      upgradeOption: true
    }
  },
  // Xiaomi 14 Ultra
  {
    id: 'plan-9-xiaomi14ultra',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra',
    name: 'Essential Guard',
    premiumPerMonth: 13.99,
    deductible: 85,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: false,
      upgradeOption: false
    }
  },
  {
    id: 'plan-10-xiaomi14ultra',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra',
    name: 'Ultimate Guard',
    premiumPerMonth: 22.99,
    deductible: 49,
    features: {
      theft: true,
      screenRepair: true,
      waterDamage: true,
      upgradeOption: true
    }
  }
];

export const testimonials = [
  '"Fantastic service, quick repair! My screen was fixed within 24 hours." - Jane D.',
  '"Saved me hundreds after my phone was stolen! The claim process was incredibly smooth." - Mark S.',
  '"Best insurance decision I ever made. Peace of mind is priceless." - Sarah L.',
  '"Customer service is outstanding. They really care about their customers." - Mike R.'
];