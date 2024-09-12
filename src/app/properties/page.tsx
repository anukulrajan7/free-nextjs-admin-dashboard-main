"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { apiUrl } from "@/Service/index";
import { PropertyListing, PropertyListings } from "@/types/Properties";
import { getCookie } from "@/cookeies";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const TablesPage: React.FC = () => {
  const [propertiesData, setPropertiesData] = useState<PropertyListings>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [updatedName, setUpdatedName] = useState(""); // To handle name changes
  const [updatedEmail, setUpdatedEmail] = useState(""); // To handle email changes
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [user, setUser] = useState<PropertyListing>();
  const [isViewModal, setIsViewModal] = useState(false);

  const getUserInfo = async (): Promise<PropertyListings> => {
    const authToken: string | undefined = getCookie("token");

    if (authToken) {
      const response = await fetch(apiUrl.getAllPropertiesDeteails, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Authorization header with Bearer token
        },
      });

      if (response.ok) {
        const properties: {
          code: number;
          data: PropertyListings;
        } = await response.json();
        return properties.data;
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
      setPropertiesData(data);
    };

    fetchData();
  }, []);

  const handleEditClick = (properties: PropertyListing) => {
    // setUpdatedName(pr.name);
    // setUpdatedEmail(user.email);
    setIsModalOpen(true); // Open modal when edit is clicked
  };

  const handleViewClick = (userData: PropertyListing) => {
    if (userData) {
      setUser(userData);
      setIsViewModal(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

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

  console.log(propertiesData);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />

      <div className="r max-h-[70vh] w-full max-w-[90vw] overflow-auto bg-slate-100 p-4 shadow-lg ">
        <table className="w-full shadow-lg shadow-gray">
          <thead>
            <tr>
              <th className="font-l s rounded-tl-lg border-r border-[#F2F8F6]  bg-[#181A53] px-4 py-2 text-white">
                User Name
              </th>
              <th className=" border-r border-[#F2F8F6]   bg-[#181A53]    px-4 py-3 font-[500] text-[#F2F8F6]">
                Email
              </th>
              <th className=" border-r border-[#F2F8F6]  bg-[#181A53]    px-4 py-3 font-[500] text-[#F2F8F6]">
                Number
              </th>
              <th className=" border-r border-[#F2F8F6]  bg-[#181A53]    px-4 py-3 font-[500] text-[#F2F8F6]">
                Balance
              </th>
              <th className="rounded-tr-md       bg-[#181A53]    px-4 py-3 font-[500] text-[#F2F8F6]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {propertiesData.map(
              (properties) =>
                properties && (
                  <tr
                    key={properties._id}
                    className="hover:bg-gray-100 bg-white hover:bg-gray-3"
                  >
                    <td className="border-b border-r border-[#181A53]  px-7 py-3 text-[1rem] font-[400] capitalize text-[#181A53]">
                      {" "}
                      <div className=" flex items-center justify-start gap-4">
                        <Image
                          width={20}
                          height={20}
                          objectFit="center"
                          className="h-8 w-8 rounded-full object-cover object-center"
                          alt={properties.building_name}
                          src={
                            properties.images[0] || "/images/user/user-06.png"
                          }
                        />
                        <p>{properties.building_name}</p>
                      </div>
                    </td>
                    <td className="border-b border-r border-[#181A53]  px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.address}
                    </td>
                    <td className="border-b border-r border-[#181A53]  px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.pincode}
                    </td>
                    <td className="border-b border-r border-[#181A53]  px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.security_deposit}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button>
                          <FaEye
                            className="cursor-pointer text-lg text-[#BDEA09]"
                            onClick={() => {
                              handleViewClick(properties);
                            }}
                          />
                        </button>
                        <button
                          className="text-[#181A53] hover:underline"
                          onClick={() => handleEditClick(properties)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
            )}
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
