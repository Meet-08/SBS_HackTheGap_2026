import { useState } from 'react';
import { MapPin, Sprout, Sun, Ruler } from 'lucide-react';

const Prediction = () => {
  const locationData: Record<string, string[]> = {
    "Maharashtra": ["Pune", "Nagpur", "Nashik", "Satara"],
    "Punjab": ["Amritsar", "Ludhiana", "Patiala", "Jalandhar"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"]
  };

  const [formData, setFormData] = useState({
    state: '',
    district: '',
    crop: '',
    season: 'Kharif',
    year: '2026',
    area: ''
  });

  const availableDistricts = formData.state ? locationData[formData.state] : [];

  return (
    <div className="bg-[#FAF7F2] py-12 px-4 font-sans text-[#4A3F35]">
     
      <div className="max-w-xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-serif font-bold mb-4 text-[#2D241E]">
          Predict Your Crop Yield
        </h1>
        <p className="text-gray-600 mb-6">
          Get an estimate based on past climate and soil patterns. Simple inputs, useful insights.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="bg-[#EFE5D5] p-8 rounded-xl shadow-sm border border-[#E7DBC7]">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-[#A67C52] w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">
                Crop & Location Details
              </h2>
              <p className="text-sm text-gray-500">
                This helps us match historical district data.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">State</label>
              <select 
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, district: '' })}
                className="p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D9A282]"
              >
                <option value="">Select your state</option>
                {Object.keys(locationData).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">District</label>
              <select 
                value={formData.district}
                disabled={!formData.state}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className={`p-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D9A282] ${
                  !formData.state ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
              >
                <option value="">
                  {formData.state ? "Select district" : "Select a state first"}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#EFE5D5] p-8 rounded-xl shadow-sm border border-[#E7DBC7]">
          <div className="flex items-center gap-3 mb-6">
            <Sprout className="text-[#6B8E23] w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">Crop Information</h2>
              <p className="text-sm text-gray-500">Choose the crop you plan to grow this season.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Crop</label>
            <select 
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="p-3 rounded-lg border border-gray-200 bg-white max-w-xs focus:outline-none focus:ring-2 focus:ring-[#D9A282]"
            >
              <option value="">Select crop type</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
            </select>
          </div>
        </div>

        <div className="bg-[#EFE5D5] p-8 rounded-xl shadow-sm border border-[#E7DBC7]">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="text-[#D97706] w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">Season & Year</h2>
              <p className="text-sm text-gray-500">Prediction is based on past climate trends.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Season</label>
              <div className="grid grid-cols-3 gap-4">
                {['Kharif', 'Rabi', 'Whole'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, season: s })}
                    className={`py-3 px-4 rounded-lg border bg-white flex flex-col items-center gap-1 transition-all ${
                      formData.season === s ? 'border-[#D9A282] ring-2 ring-[#D9A282]' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-xs">{s === 'Kharif' ? '🌧️' : s === 'Rabi' ? '❄️' : '🌸'}</span>
                    <span className="font-medium text-sm">{s}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Growing Year</label>
              <select 
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="p-3 rounded-lg border border-gray-200 bg-white max-w-[120px] focus:outline-none focus:ring-2 focus:ring-[#D9A282]"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#EFE5D5] p-8 rounded-xl shadow-sm border border-[#E7DBC7]">
          <div className="flex items-center gap-3 mb-6">
            <Ruler className="text-gray-500 w-6 h-6" />
            <div>
              <h2 className="font-bold text-lg">Land Details</h2>
              <p className="text-sm text-gray-500">Enter total land area used for this crop.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Cultivated Area</label>
            <div className="relative max-w-full">
              <input 
                type="number" 
                placeholder="e.g. 1.5" 
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white pr-20 focus:outline-none focus:ring-2 focus:ring-[#D9A282]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                hectares
              </span>
            </div>
          </div>
        </div>

        <div className="text-center pt-2 flex flex-col items-center gap-2"> 
         <button className="bg-[#C2592A] hover:bg-[#A14822] text-white font-bold py-3 px-8 rounded-lg transition-colors">
           Predict Yield
         </button>

         <p className="text-sm text-gray-500 italic">
           Prediction may take a few seconds.
         </p>
        </div>
      </div>
    </div>
  );
};

export default Prediction;