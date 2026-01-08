import { MapPin, Cloud, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Select Location & Crop",
    desc: "Choose your district, crop type, and sowing date to begin the prediction process.",
  },
  {
    number: "02",
    icon: Cloud,
    title: "Data Collection",
    desc: "We fetch historical weather data from NASA POWER and soil attributes from SoilGrids.",
  },
  {
    number: "03",
    icon: Cpu,
    title: "AI Processing",
    desc: "Our XGBoost model analyzes the data considering temperature, rainfall, and humidity.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Get Predictions",
    desc: "Receive yield predictions with confidence ranges and actionable recommendations.",
  },
];

export default function StepCard() {
  return (
    <section className="bg-[#FAF7F2] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-[#2D2A26] mb-3">
            How It Works
          </h2>
          <p className="text-[#888] text-xl">
            Get accurate yield predictions in four simple steps
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] bg-gray-300 border-t border-gray-400"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-20">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center relative max-w-xs mx-auto group">
                <div className="w-25 h-24 bg-[#EBE0D0] rounded-xl flex items-center justify-center mb-6 relative shadow-sm transition-transform group-hover:-translate-y-2">
                  
                  <div className="absolute -top-2 -right-2 w-9 h-9 bg-[#D96C36] rounded-full text-white text-l flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <step.icon className="w-12 h-12 text-[#D96C36]" />
                </div>

                <h3 className="text-xl font-bold text-[#2D2A26] mb-2">
                  {step.title}
                </h3>
                <p className="text-m text-[#666] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}