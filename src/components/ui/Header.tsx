import { Heart } from "lucide-react";

const Header = () => (
  <div className="flex items-center justify-center lg:justify-start gap-2 p-6 lg:p-12">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <Heart className="w-5 h-5 text-white fill-current" />
    </div>
    <span className="font-bold text-primary text-xl lg:text-2xl">BloodLink</span>
  </div>
);

export default Header;
