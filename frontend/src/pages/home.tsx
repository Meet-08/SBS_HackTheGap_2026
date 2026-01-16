import { useAppDispatch, useAppSelector } from "@/app/hooks";
import logo from "@/assets/icons/logo.png";
import ctaImage from "@/assets/images/cta.png";
import DataSourcesSection from "@/components/data-source-section";
import HeroSlider from "@/components/hero-slider";
import StepCard from "@/components/step-card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { logout } from "@/redux/authSlice";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

function Home() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <div className="bg-[#FAF7F2]">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#F5F1E6]/90 backdrop-blur-md border-b border-[#E0D6C8]">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="CropPredict Logo" className="size-13" />

          {/* <span className="text-2xl font-extrabold tracking-tight text-[#1A2B3C] font-['Montserrat',_sans-serif]">
            Crop<span className="text-[#758D45]">Predict</span>
          </span> */}
        </div>

        <div className="absolute left-[55%] -translate-x-[50%]">
          {/* <h1 className="flex items-center gap-10 text-3xl font-serif text-[#785028] tracking-widest text-opacity-80"> */}
          <h1 className="flex items-center gap-5 text-4xl font-serif text-[#785028] tracking-widest text-opacity-80">
            <span>Predict.</span>
            <span>Optimize.</span>
            <span>Grow.</span>
          </h1>
        </div>

        {user ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <HoverCard>
              <HoverCardTrigger>
                <div className="size-13 rounded-full bg-[#758D45] flex items-center justify-center">
                  <p className="text-white font-bold text-xl">
                    {user.firstName[0].toUpperCase()}
                    {user.lastName[0].toUpperCase()}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-72 p-4" align="end">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E0D6C8]">
                    <div className="size-10 rounded-full bg-[#758D45] flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {user.firstName[0].toUpperCase()}
                        {user.lastName[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="font-semibold text-[#1A2B3C] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-[#6B7280] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-[#1A2B3C] hover:bg-[#F5F1E6] hover:text-[#758D45]"
                      onClick={() => navigate("/user-dashboard")}
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="px-5 py-2 bg-[#758D45] text-white font-bold text-sm rounded shadow-sm hover:bg-[#637a38] transition-colors"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="px-8 py-2 border border-[#785028] text-[#785028] font-bold text-sm rounded hover:bg-[#EBE0D0] transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        )}
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
          <img
            src={ctaImage}
            alt="Harvest Vegetables"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center text-center gap-7">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
              Ready to Grow Better?
            </h2>
            <p className="text-base md:text-xl tracking-wider text-gray-200 max-w-4xl mb-6 font-light">
              Join farmers worldwide who are using data-driven insights to
              improve their yields and sustainability.
            </p>
            <button
              className="px-8 py-3 bg-[#C05621] text-white font-bold rounded shadow-lg hover:bg-[#a0461b] transition-transform transform hover:scale-105"
              onClick={() => navigate(user ? "/predict" : "/login")}
            >
              Start Predicting Now
            </button>
          </div>
        </div>

        <div className="text-center mt-8 pb-4">
          <p className="text-[#4A4A4A] text-sm">
            © 2025 Crop Prediction & Yield Optimizer
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
