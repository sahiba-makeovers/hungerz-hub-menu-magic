
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-hungerzblue hover:text-hungerzorange"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Button>
        </Link>
        <Logo />
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
