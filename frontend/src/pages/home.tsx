import Facebook from "@/assets/icons/facebook.png";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-700">
      <Button
        variant="outline"
        size="lg"
        onClick={() => console.log("Button Clicked")}
      >
        Welcome to the Home Page
      </Button>
      <img
        src={Facebook}
        alt="Facebook Icon"
        className="h-8 w-8 object-cover"
      />
    </div>
  );
};

export default Home;
