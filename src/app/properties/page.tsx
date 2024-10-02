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
import ViewModal from "@/components/ViewModal";

const TablesPage: React.FC = () => {
  const [propertiesData, setPropertiesData] = useState<PropertyListings>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [user, setUser] = useState<PropertyListing>();
  const [isViewModal, setIsViewModal] = useState(false);
  const [rentType, setRentType] = useState<"buy" | "rent" | "sale">("buy");
  const [facing, setFacing] = useState<"north" | "south" | "east" | "west">(
    "north",
  );
  const [property_type, setPropertyType] = useState<
    "Residential" | "Commercial"
  >("Residential");
  const [property_posted_by, setPropertyPostedBy] = useState<"agent" | "owner">(
    "agent",
  );
  const [property_subtype, setPropertySubType] = useState<string>("");
  const [pincode, setPincode] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this to set how many items per page

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
    setRentType(properties.listing_type);
    setUser(properties);
    setPincode(properties.pincode);
    setFacing(properties.facing);
    setPropertyType(properties.property_type);
    setPropertyPostedBy(properties.property_posted_by);
    setPropertySubType(properties.property_subtype);
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

    if (!authToken || !user?._id) {
      console.error("Authorization token or User ID is missing");
      return;
    }

    if (!pincode) {
      return;
    }

    const url = `${apiUrl.updateProperty}`;

    try {
      const postBody = {
        propertyId: user._id,
        property_type: property_type,
        property_subtype: property_subtype,
        listing_type: rentType,
        pincode: pincode,
        facing: facing,
        property_posted_by: property_posted_by,
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
      // Refresh data after update
      const updatedData = await getUserInfo();
      setPropertiesData(updatedData);
    } catch (error) {
      console.error("Error during POST request:", error);
      toast.error("Error in update");
    }
  };

  // Calculate current properties to display
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = propertiesData.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  );

  // Calculate total pages
  const totalPages = Math.ceil(propertiesData.length / itemsPerPage);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Properties" />

      <div className="r max-h-[70vh] w-full max-w-[90vw] overflow-auto bg-slate-100 p-4 shadow-lg ">
        <table className="w-full shadow-lg shadow-gray">
          <thead>
            <tr>
              <th className="font-l s min-w-[10rem] rounded-tl-lg border-r border-[#F2F8F6]  bg-[#181A53] px-4 py-2 text-white">
                User Name
              </th>
              <th className="min-w-[10rem] border-r border-[#F2F8F6] bg-[#181A53] px-4 py-3 font-[500] text-[#F2F8F6]">
                Email
              </th>
              <th className="min-w-[10rem] border-r border-[#F2F8F6] bg-[#181A53] px-4 py-3 font-[500] text-[#F2F8F6]">
                Number
              </th>
              <th className="min-w-[10rem] border-r border-[#F2F8F6] bg-[#181A53] px-4 py-3 font-[500] text-[#F2F8F6]">
                Balance
              </th>
              <th className="rounded-tr-md bg-[#181A53] px-4 py-3 font-[500] text-[#F2F8F6]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProperties.map(
              (properties) =>
                properties && (
                  <tr
                    key={properties._id}
                    className="hover:bg-gray-100 bg-white hover:bg-gray-3"
                  >
                    <td className="border-b border-r border-[#181A53] px-7 py-3 text-[1rem] font-[400] capitalize text-[#181A53]">
                      <div className="flex items-center justify-start gap-4">
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
                    <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.address}
                    </td>
                    <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.pincode}
                    </td>
                    <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                      {properties.security_deposit}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button>
                          <FaEye
                            className="cursor-pointer text-lg text-[#BDEA09]"
                            onClick={() => handleViewClick(properties)}
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

      {/* Pagination Controls */}
      <div>
        {/* Pagination Controls */}
        {propertiesData.length > totalPages && (
          <div className="mt-4 flex items-center justify-between">
            <button
              className={`rounded bg-[#BDEA09] px-4 py-2 text-[#0E0E0C] ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="font-semibold text-[#0E0E0C]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`rounded bg-[#BDEA09] px-4 py-2 text-[#0E0E0C] ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 z-[10000] flex items-center justify-center  bg-[#5f5f5f] bg-opacity-50 backdrop-blur-[2px]"
        >
          <div
            className="relative max-h-[90vh] min-w-[90%] transform overflow-y-auto  rounded-[25px] bg-[#0E0E0C] p-6 px-9 shadow-lg shadow-graydark transition-all  ease-in-out md:min-w-[30%] lg:min-w-[25%]"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <IoClose
              className=" absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09]"
              onClick={handleModalClose}
            />
            <h3 className="mb-4 text-center text-[1rem] font-[500] text-[#F2F8F6]">
              Update Properties Listing Type
            </h3>

            <div className="grid items-center gap-1 md:grid-cols-2">
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

              <div className="mb-4 flex flex-col items-center justify-center ">
                <label className="mb-3 block max-w-[200px] text-center text-sm font-medium text-white">
                  Properties Facing Direction
                </label>
                <select
                  value={facing}
                  className="w-full max-w-[200px] rounded-md bg-[#F2F8F6] px-4 py-2 font-satoshi text-[1rem] font-[500] text-black"
                  onChange={(e) =>
                    setFacing(
                      e.target.value as "north" | "south" | "east" | "west",
                    )
                  }
                >
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                </select>
              </div>

              <div className="mb-4 flex flex-col items-center justify-center ">
                <label className="mb-3 block max-w-[200px] text-center text-sm font-medium text-white">
                  Properties Type
                </label>
                <select
                  value={property_type}
                  className="w-full max-w-[200px] rounded-md bg-[#F2F8F6] px-4 py-2 font-satoshi text-[1rem] font-[500] text-black"
                  onChange={(e) =>
                    setPropertyType(
                      e.target.value as "Residential" | "Commercial",
                    )
                  }
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="mb-4 flex flex-col items-center justify-center ">
                <label className="mb-3 block max-w-[200px] text-center text-sm font-medium text-white">
                  Properties Posted By
                </label>
                <select
                  value={property_posted_by}
                  className="w-full max-w-[200px] rounded-md bg-[#F2F8F6] px-4 py-2 font-satoshi text-[1rem] font-[500] text-black"
                  onChange={(e) =>
                    setPropertyPostedBy(e.target.value as "agent" | "owner")
                  }
                >
                  <option value="agent">Agent</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="relative">
                <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                  Properties Sub Type
                </label>
                <input
                  type="text"
                  value={property_subtype}
                  onChange={(e) => setPropertySubType(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                />
              </div>
              <div className="relative">
                <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                  Properties PinCode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
                />
              </div>
            </div>

            <div className="my-3 flex  items-center justify-center gap-3 space-x-4">
              <button
                className="rounded bg-[#BDEA09] px-[90px] py-2 text-lg font-semibold text-[#0E0E0C] hover:bg-[#d2e87c]"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        {isViewModal && user && (
          <ViewModal
            handleOutsideClick={handleOutsideClick}
            user={user}
            setIsViewModal={setIsViewModal}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
