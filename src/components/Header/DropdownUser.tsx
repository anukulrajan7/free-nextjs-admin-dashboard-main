import { useState } from "react";
import Link from "next/link";

import ClickOutside from "@/components/ClickOutside";

import { MdManageAccounts } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const removeCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict`;
  };
  const handleLogout = () => {
    // Perform any logout operations like clearing session or calling an API if needed

    // Remove the token cookie
    removeCookie("token");

    toast.success("Log out user");
    router.push("/sign-in");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <MdManageAccounts className="cursor-pointer text-[2rem] text-[#BDEA09]" />
      </Link>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg">
          <button
            className="text-gray-800 hover:bg-gray-100 block  w-full bg-[#BDEA09] px-4 py-2"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
