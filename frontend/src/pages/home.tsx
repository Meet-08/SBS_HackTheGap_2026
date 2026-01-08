import { useNavigate } from 'react-router-dom';
import HeroSlider from "@/components/heroslider";
import StepCard from "@/components/stepcard";
import DataSourcesSection from "@/components/datasourcesection";
import ctaImage from '../assets/icons/cta.png';
import logo from '../assets/icons/logo.png'; 

function Home() {
  const navigate = useNavigate();
 
  return (
    <div className="bg-[#FAF7F2] ">
    
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#F5F1E6]/90 backdrop-blur-md border-b border-[#E0D6C8]">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="CropPredict Logo" className="w-13 h-13 "/>
         
          <span className="text-2xl font-extrabold tracking-tight text-[#1A2B3C] font-['Montserrat',_sans-serif]">
            Crop<span className="text-[#758D45]">Predict</span>
          </span>
        </div>

        <div className="md:block">
          <h1 className="flex items-center gap-10 text-3xl font-serif text-[#785028] tracking-widest text-opacity-80">
            <span>Predict.</span>
            <span>Optimize.</span>
            <span>Grow.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-[#758D45] text-white font-bold text-sm rounded shadow-sm hover:bg-[#637a38] transition-colors" onClick={() => navigate('/register')}>
            Get Started
          </button>
          
          <button className="px-8 py-2 border border-[#785028] text-[#785028] font-bold text-sm rounded hover:bg-[#EBE0D0] transition-colors" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </nav>

      <div className="px-4 md:px-8 py-6">
         <HeroSlider /> 
      </div>

      <div className="md:px-27">
         <StepCard /> 
      </div>

      <div className="md:px-27">
         <DataSourcesSection /> 
      </div>

      <div className="md:px-8 pb-8">
          <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl">
              <img src={ctaImage} alt="Harvest Vegetables" className="w-full h-full object-cover"/>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center text-center gap-7">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                      Ready to Grow Better?
                  </h2>
                  <p className="text-base md:text-xl tracking-wider text-gray-200 max-w-4xl mb-6 font-light">
                      Join farmers worldwide who are using data-driven insights to improve their yields and sustainability.
                  </p>
                  <button className="px-8 py-3 bg-[#C05621] text-white font-bold rounded shadow-lg hover:bg-[#a0461b] transition-transform transform hover:scale-105" onClick={() => navigate('/predict')}>
                      Start Predicting Now
                  </button>
              </div>
          </div>
          
          <div className="text-center mt-8 pb-4">
              <p className="text-[#4A4A4A] text-sm">© 2025 Crop Prediction & Yield Optimizer</p>
          </div>
      </div>

    </div>
  );
}

export default Home;