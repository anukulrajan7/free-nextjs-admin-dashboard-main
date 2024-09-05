"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { apiUrl } from "@/Service/index";
import { UserProfiles } from "@/types/userDetails";
import { getCookie } from "@/cookeies";

const TablesPage: React.FC = () => {
  const [userData, setUserData] = useState<UserProfiles>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null); // Hold selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [updatedName, setUpdatedName] = useState(""); // To handle name changes
  const [updatedEmail, setUpdatedEmail] = useState(""); // To handle email changes
  const [errors, setErrors] = useState({ name: "", email: "" });

  const getUserInfo = async (): Promise<UserProfiles> => {
    const authToken: string | undefined = getCookie("token");

    if (authToken) {
      const response = await fetch(apiUrl.getAllUsers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Authorization header with Bearer token
        },
      });

      if (response.ok) {
        const userData: UserProfiles = await response.json();
        return userData;
      } else {
        console.error("Failed to fetch user data", response.status);
        return [];
      }
    } else {
      console.error("Auth token is missing");
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserInfo();
      setUserData(data);
    };

    fetchData();
  }, []);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setIsModalOpen(true); // Open modal when edit is clicked
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setErrors({ name: "", email: "" });
  };

  const handleOutsideClick = (e: any) => {
    if (e.target.id === "modal-background") {
      handleModalClose();
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!updatedName) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else if (
      !updatedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)
    ) {
      setErrors((prev) => ({ ...prev, email: "Valid email is required" }));
    } else {
      // Perform submission logic here
      console.log("Updated user info:", { updatedName, updatedEmail });
      handleModalClose();
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />

      <div className="max-h-[70vh] w-full max-w-[90vw] overflow-auto rounded-md bg-slate-100 p-4 shadow-lg">
        <table className="w-full border-collapse bg-white shadow-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Number</th>
              <th className="border px-4 py-2">Balance</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 bg-white">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.number}</td>
                <td className="border px-4 py-2">{user.balance}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-background"
          className="bg-gray-900 fixed inset-0 z-10 flex items-center justify-center bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div
            className="transform rounded-lg bg-white p-6 shadow-lg transition-all ease-in-out"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <h3 className="mb-4 text-xl font-semibold">Edit User</h3>
            <div className="mb-4">
              <label className="text-gray-700 block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-gray-700 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 rounded px-4 py-2 text-white"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
