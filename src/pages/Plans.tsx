import React, { useState } from 'react';
import { Check, X, Shield, Zap, Droplets, Star, TrendingUp, Award, Search, Filter } from 'lucide-react';
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
  const [showComparison, setShowComparison] = useState(false);

  // Get recommended plans (premium plans from popular devices)
  const getRecommendedPlans = () => {
    return insurancePlans.filter(plan => 
      (plan.name.includes('Premium') || plan.name.includes('Ultimate')) &&
      (plan.brand === 'Apple' || plan.brand === 'Samsung' || plan.brand === 'Google Pixel')
    ).slice(0, 3);
  };

  const recommendedPlans = getRecommendedPlans();

  const handleGeneratePlans = async () => {
    if (!selectedBrand || !selectedModel) return;
    
    setIsLoading(true);
    setShowComparison(false);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plans = insurancePlans.filter(
      plan => plan.brand === selectedBrand && plan.model === selectedModel
    );
    setFilteredPlans(plans);
    setIsLoading(false);
  };

  const handleEnrollNow = (plan: InsurancePlan) => {
    alert(`Enrollment initiated for ${plan.name}!\n\nPlan Details:\n• Monthly Premium: $${plan.premiumPerMonth}\n• Deductible: $${plan.deductible}\n• Device: ${plan.brand} ${plan.model}\n\nYou would be redirected to the secure payment page.`);
  };

  const resetSelection = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setFilteredPlans([]);
    setShowComparison(false);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'theft': return Shield;
      case 'screenRepair': return Zap;
      case 'waterDamage': return Droplets;
      case 'upgradeOption': return TrendingUp;
      default: return Check;
    }
  };

  const getFeatureLabel = (feature: string) => {
    switch (feature) {
      case 'theft': return 'Theft Protection';
      case 'screenRepair': return 'Screen Repair';
      case 'waterDamage': return 'Water Damage';
      case 'upgradeOption': return 'Upgrade Option';
      default: return feature;
    }
  };

  const PlanCard = ({ plan, isRecommended = false, index = 0 }: { 
    plan: InsurancePlan; 
    isRecommended?: boolean; 
    index?: number; 
  }) => (
    <Card 
      key={plan.id} 
      className={`relative transform hover:scale-105 transition-all duration-300 hover:shadow-xl ${
        isRecommended ? 'ring-2 ring-accent-200' : ''
      }`}
    >
      {(plan.name.includes('Premium') || plan.name.includes('Ultimate')) && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
          <Award className="h-3 w-3" />
          <span>Popular</span>
        </div>
      )}
      
      <div className="text-center mb-6">
        {!isRecommended && (
          <div className="text-sm text-gray-500 mb-2 font-medium">
            {plan.brand} {plan.model}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
        <div className="text-4xl font-bold text-primary-600 mb-2">
          ${plan.premiumPerMonth}
          <span className="text-lg font-normal text-gray-600">/month</span>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
          ${plan.deductible} deductible
        </div>
      </div>
      
      <div className="space-y-3 mb-8">
        {Object.entries(plan.features).map(([feature, included]) => {
          const Icon = getFeatureIcon(feature);
          return (
            <div key={feature} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                included ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {included ? <Icon className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <span className={`text-sm font-medium ${included ? 'text-gray-900' : 'text-gray-500'}`}>
                {getFeatureLabel(feature)}
              </span>
            </div>
          );
        })}
      </div>
      
      <Button
        onClick={() => handleEnrollNow(plan)}
        className={`w-full transition-all duration-200 ${
          plan.name.includes('Premium') || plan.name.includes('Ultimate') 
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg' 
            : ''
        }`}
        variant={plan.name.includes('Premium') || plan.name.includes('Ultimate') ? 'primary' : 'outline'}
      >
        Get This Plan
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect
            <span className="block text-accent-300">Insurance Plan</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Comprehensive smartphone protection tailored to your device and budget. 
            Join thousands of satisfied customers who trust PhoneGuard.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Recommended Plans Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Star className="h-8 w-8 text-accent-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recommended Plans</h2>
              <Star className="h-8 w-8 text-accent-500" />
            </div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our most popular insurance plans trusted by thousands of customers. 
              These premium options offer comprehensive coverage for today's flagship devices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recommendedPlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} isRecommended={true} index={index} />
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white rounded-full shadow-md">
              <span className="text-gray-600">Want plans for your specific device?</span>
              <Search className="h-5 w-5 text-primary-500" />
            </div>
          </div>
        </div>

        {/* Device Selector Section */}
        <Card className="mb-12 bg-white shadow-xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Filter className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Find Plans for Your Device</h2>
            </div>
            <p className="text-gray-600">
              Select your phone brand and model to see customized insurance plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Brand
              </label>
              <Select
                options={phoneBrands}
                value={selectedBrand}
                onChange={(value) => {
                  setSelectedBrand(value);
                  setSelectedModel('');
                  setFilteredPlans([]);
                  setShowComparison(false);
                }}
                placeholder="Choose brand"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Model
              </label>
              <Select
                options={selectedBrand ? phoneModels[selectedBrand as keyof typeof phoneModels] : []}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder="Choose model"
                disabled={!selectedBrand}
              />
            </div>
            
            <div>
              <Button
                onClick={handleGeneratePlans}
                disabled={!selectedBrand || !selectedModel}
                loading={isLoading}
                className="w-full h-11"
              >
                {isLoading ? 'Finding Plans...' : 'Find Plans'}
              </Button>
            </div>

            <div>
              <Button
                onClick={resetSelection}
                variant="outline"
                disabled={!selectedBrand && !selectedModel}
                className="w-full h-11"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Finding the best plans for your {selectedBrand} {selectedModel}
                </h3>
                <p className="text-gray-600">This may take a few seconds...</p>
              </div>
            </div>
          </Card>
        )}

        {/* Plans Display */}
        {filteredPlans.length > 0 && !isLoading && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Plans for {selectedBrand} {selectedModel}
                </h2>
                <p className="text-gray-600">
                  {filteredPlans.length} plan{filteredPlans.length > 1 ? 's' : ''} found
                </p>
              </div>
              {filteredPlans.length > 1 && (
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  variant="outline"
                  className="mt-4 sm:mt-0"
                >
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {filteredPlans.length > 1 && showComparison && (
          <Card className="mb-12 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Compare Plans Side by Side
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 sticky left-0 bg-gray-50">
                      Features
                    </th>
                    {filteredPlans.map((plan) => (
                      <th key={plan.id} className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[200px]">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-primary-25">
                    <td className="py-4 px-6 font-semibold text-gray-900 sticky left-0 bg-primary-25">
                      Monthly Premium
                    </td>
                    {filteredPlans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-6">
                        <span className="text-2xl font-bold text-primary-600">
                          ${plan.premiumPerMonth}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold text-gray-900 sticky left-0 bg-white">
                      Deductible
                    </td>
                    {filteredPlans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-6 font-semibold">
                        ${plan.deductible}
                      </td>
                    ))}
                  </tr>
                  {Object.keys(filteredPlans[0].features).map((feature) => (
                    <tr key={feature} className="border-b hover:bg-gray-25">
                      <td className="py-4 px-6 font-semibold text-gray-900 sticky left-0 bg-white">
                        {getFeatureLabel(feature)}
                      </td>
                      {filteredPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-6">
                          {plan.features[feature as keyof typeof plan.features] ? (
                            <div className="flex items-center justify-center">
                              <Check className="h-6 w-6 text-primary-500" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <X className="h-6 w-6 text-gray-400" />
                            </div>
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
          <Card className="text-center py-12">
            <Shield className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Plans Available
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We don't currently have insurance plans for the {selectedBrand} {selectedModel}. 
              Please try another device or contact us for custom coverage options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetSelection} variant="outline">
                Try Another Device
              </Button>
              <Button onClick={() => alert('Contact form would open here')}>
                Request Custom Quote
              </Button>
            </div>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center mt-16">
          <div className="py-12">
            <h2 className="text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Our insurance experts are here to help you choose the perfect protection plan for your device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                Chat with Expert
              </Button>
              <Button className="bg-accent-500 hover:bg-accent-600 text-white">
                Call (800) GUARD-ME
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Plans;