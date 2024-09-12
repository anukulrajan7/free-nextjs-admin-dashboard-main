import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { getCookie } from "@/cookeies";
import { UserProfile } from "@/types/userDetails";
import { apiUrl } from "@/Service";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserInfo = async (): Promise<void> => {
    const authToken: string | undefined = getCookie("token");

    if (authToken) {
      try {
        const response = await fetch(apiUrl.getUserDetail, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Authorization header with Bearer token
          },
        });

        if (response.ok) {
          const userData: UserProfile = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data", response.status);
        }
      } catch (error) {
        console.error("An error occurred while fetching user data", error);
      }
    } else {
      console.error("Auth token is missing");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user ? user.name : "User Name"}
          </span>
          <span className="block text-xs">{user ? user.name : "Role"}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={user?.profilePicture || "/images/user/user-01.png"}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg">
          <button
            className="text-gray-800 hover:bg-gray-100 block w-full px-4 py-2 text-left"
            onClick={() => {
              /* Handle logout */
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
