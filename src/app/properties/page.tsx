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
import { toast } from "react-toastify";

const TablesPage: React.FC = () => {
  const [propertiesData, setPropertiesData] = useState<PropertyListings>([]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const [errors, setErrors] = useState({ name: "", email: "" });
  const [user, setUser] = useState<PropertyListing>();
  const [isViewModal, setIsViewModal] = useState(false);
  const [rentType, setRentType] = useState<"buy" | "rent" | "sale">("buy");
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
    setRentType(properties.listing_type);
    setUser(properties);
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

  const handleSubmit = async () => {
    const authToken: string | undefined = getCookie("token");

    // Check if authToken and user ID are available
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    if (!user?._id) {
      console.error("User ID is missing");
      return;
    }

    const url = `${apiUrl.updateProperty}/${user._id}`;
    console.log("API URL:", url); // Log the API URL

    try {
      const postBody = {
        listing_type: rentType,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(postBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      toast.success("Properties Listing Type updated");
      // Handle the response data here
    } catch (error) {
      console.error("Error during POST request:", error);
      toast.error("Error in update");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Properties" />

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
          className="fixed inset-0 z-10 flex items-center justify-center  bg-[#5f5f5f] bg-opacity-50 backdrop-blur-[2px]"
        >
          <div
            className="relative min-w-[80%] transform  rounded-[25px] bg-[#0E0E0C] p-6 px-9 shadow-lg shadow-graydark transition-all  ease-in-out md:min-w-[30%] lg:min-w-[25%]"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <IoClose
              className=" absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09]"
              onClick={handleModalClose}
            />
            <h3 className="mb-4 text-center text-[1rem] font-[500] text-[#F2F8F6]">
              Update Properties Listing Type
            </h3>

            <div className="mb-4 flex flex-col items-center justify-center ">
              <label className="mb-3 block max-w-[200px] text-center text-sm font-medium text-white">
                Properties Listing Type
              </label>
              <select
                value={rentType}
                className="w-full max-w-[200px]  rounded-md bg-[#F2F8F6] px-4 py-2 font-satoshi text-[1rem] font-[500] text-black"
                onChange={(e) =>
                  setRentType(e.target.value as "buy" | "rent" | "sale")
                }
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <div className="mt-3 flex  items-center justify-center gap-3 space-x-4">
              <button
                className="rounded bg-[#BDEA09] px-[50px] py-2 text-lg font-semibold text-[#0E0E0C] hover:bg-[#d2e87c]"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModal && user && (
        <div
          id="modal-background"
          className="fixed inset-0 z-[1000] flex items-center justify-center  overflow-y-auto bg-[#5f5f5f] bg-opacity-50   backdrop-blur-[2px]"
          onClick={handleOutsideClick}
        >
          <div
            className="relative mt-[20vh]  min-w-[80%] transform rounded-[25px] bg-[#0E0E0C] p-6 px-9 shadow-lg shadow-graydark transition-all  ease-in-out md:min-w-[40%] lg:min-w-[50%]"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <IoClose
              className=" absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09]"
              onClick={() => {
                setIsViewModal(false);
              }}
            />
            <Image
              width={80}
              height={20}
              objectFit="center"
              className="mx-auto mb-4 h-[100px] w-[80%] rounded-md object-contain "
              alt={user.building_name || "image"}
              src={user.images[0] || "/images/user/user-06.png"}
            />
            <div>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Building Name
                  </label>
                  <input
                    type="text"
                    value={user.building_name}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={user.address}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Available From
                  </label>
                  <input
                    type="text"
                    value={user.available_from}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    No of Bathroom
                  </label>
                  <input
                    type="text"
                    value={user.bathrooms}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={user.owner_name}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Owner Phone No
                  </label>
                  <input
                    type="text"
                    value={user.owner_phone}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Building Overview
                  </label>
                  <input
                    type="text"
                    value={user.description}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    No of Bed Room
                  </label>
                  <input
                    type="text"
                    value={user.bedrooms}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Facilities
                  </label>
                  <input
                    type="text"
                    value={user.facilities}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    furnish Type
                  </label>
                  <input
                    type="text"
                    value={user.furnish_type}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Building Name
                  </label>
                  <input
                    type="text"
                    value={user.building_name}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Monthly Rent
                  </label>
                  <input
                    type="text"
                    value={user.monthly_rent}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Security Deposit
                  </label>
                  <input
                    type="text"
                    value={user.security_deposit}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                    Listing Type
                  </label>
                  <input
                    type="text"
                    value={user.listing_type}
                    disabled={true}
                    className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
