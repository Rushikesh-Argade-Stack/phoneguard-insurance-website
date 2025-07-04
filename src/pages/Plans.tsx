import React, { useState } from 'react';
import { Check, X, Shield, Zap, Droplets, TrendingUp } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Select from '../components/UI/Select';
import { phoneModels, phoneBrands } from '../data/phoneData';
import { insurancePlans, InsurancePlan } from '../data/planData';

const Plans: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredPlans, setFilteredPlans] = useState<InsurancePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlans = async () => {
    if (!selectedBrand || !selectedModel) return;
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const plans = insurancePlans.filter(
      plan => plan.brand === selectedBrand && plan.model === selectedModel
    );
    setFilteredPlans(plans);
    setIsLoading(false);
  };

  const handleEnrollNow = (plan: InsurancePlan) => {
    alert(`Enrollment initiated for ${plan.name}! You would be redirected to the secure payment page.`);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'theft':
        return Shield;
      case 'screenRepair':
        return Zap;
      case 'waterDamage':
        return Droplets;
      case 'upgradeOption':
        return TrendingUp;
      default:
        return Check;
    }
  };

  const getFeatureLabel = (feature: string) => {
    switch (feature) {
      case 'theft':
        return 'Theft Protection';
      case 'screenRepair':
        return 'Screen Repair';
      case 'waterDamage':
        return 'Water Damage';
      case 'upgradeOption':
        return 'Upgrade Option';
      default:
        return feature;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Insurance Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect protection plan for your smartphone. Choose your device to see available coverage options.
          </p>
        </div>

        {/* Plan Generator Section */}
        <Card className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Select Your Device
            </h2>
            <p className="text-gray-600">
              Choose your phone brand and model to see available insurance plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Brand
              </label>
              <Select
                options={phoneBrands}
                value={selectedBrand}
                onChange={(value) => {
                  setSelectedBrand(value);
                  setSelectedModel('');
                  setFilteredPlans([]);
                }}
                placeholder="Select brand"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Model
              </label>
              <Select
                options={selectedBrand ? phoneModels[selectedBrand] : []}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder="Select model"
                disabled={!selectedBrand}
              />
            </div>
            
            <div>
              <Button
                onClick={handleGeneratePlans}
                disabled={!selectedBrand || !selectedModel}
                loading={isLoading}
                className="w-full h-full"
              >
                Generate Plans
              </Button>
            </div>
          </div>
        </Card>

        {/* Plans Display */}
        {filteredPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Available Plans for {selectedBrand} {selectedModel}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="relative">
                  {plan.name.includes('Premium') || plan.name.includes('Ultimate') ? (
                    <div className="absolute top-0 right-0 bg-accent-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                      Popular
                    </div>
                  ) : null}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      ${plan.premiumPerMonth}
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    <p className="text-gray-600">
                      ${plan.deductible} deductible
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {Object.entries(plan.features).map(([feature, included]) => {
                      const Icon = getFeatureIcon(feature);
                      return (
                        <div key={feature} className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            included ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            {included ? (
                              <Icon className="h-4 w-4 text-primary-600" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className={`${included ? 'text-gray-900' : 'text-gray-500'}`}>
                            {getFeatureLabel(feature)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button
                    onClick={() => handleEnrollNow(plan)}
                    className="w-full"
                    variant={plan.name.includes('Premium') || plan.name.includes('Ultimate') ? 'primary' : 'outline'}
                  >
                    Enroll Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {filteredPlans.length > 1 && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Compare Plans Side by Side
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-medium text-gray-900">Features</th>
                    {filteredPlans.map((plan) => (
                      <th key={plan.id} className="text-center py-4 px-4 font-medium text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium text-gray-900">Monthly Premium</td>
                    {filteredPlans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4 font-bold text-primary-600">
                        ${plan.premiumPerMonth}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium text-gray-900">Deductible</td>
                    {filteredPlans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        ${plan.deductible}
                      </td>
                    ))}
                  </tr>
                  {Object.keys(filteredPlans[0].features).map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {getFeatureLabel(feature)}
                      </td>
                      {filteredPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.features[feature as keyof typeof plan.features] ? (
                            <Check className="h-5 w-5 text-primary-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* No Plans Message */}
        {selectedBrand && selectedModel && filteredPlans.length === 0 && !isLoading && (
          <Card className="text-center">
            <div className="py-8">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Plans Available
              </h3>
              <p className="text-gray-600">
                We don't currently have insurance plans for the {selectedBrand} {selectedModel}. 
                Please try another device or contact us for custom coverage options.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Plans;