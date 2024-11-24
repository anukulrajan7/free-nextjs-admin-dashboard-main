"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { apiUrl } from "@/Service/index";
import { UserProfile, UserProfiles } from "@/types/userDetails";
import { getCookie } from "@/cookeies";
import Image from "next/image";
import { FaEdit, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const TablesPage: React.FC = () => {
  const [userData, setUserData] = useState<UserProfiles>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [errors, setErrors] = useState({ name: "", email: "", balance: "" });
  const [user, setUser] = useState<UserProfile>();
  const [isViewModal, setIsViewModal] = useState(false);
  const usersPerPage = 10;
  const authToken: string | undefined = getCookie("token");

  const getUserInfo = async (): Promise<UserProfiles> => {
    if (authToken) {
      const response = await fetch(apiUrl.getAllUsers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
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

  // Pagination Logic
  const indexOfLastUser = pageNo * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userData.length / usersPerPage);

  const handleNextPage = () => {
    if (pageNo < totalPages) {
      setPageNo((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPage) => prevPage - 1);
    }
  };

  const handleOutsideClick = (e: any) => {
    if (e.target.id === "modal-background") {
      handleModalClose();
    }
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setUserBalance(user.balance);
    setIsModalOpen(true);
  };

  const handleViewClick = (userData: UserProfile) => {
    setUser(userData);
    setIsViewModal(true);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!updatedName) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }

    if (!updatedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)) {
      setErrors((prev) => ({ ...prev, email: "Valid email is required" }));
      return;
    }
    if (!(userBalance >= 0)) {
      setErrors((prev) => ({ ...prev, balance: "Balance is required" }));
      return;
    }

    if (errors.name || errors.email || errors.balance) {
      return;
    } else {
      {
        const url = `${apiUrl.updateUser}`;
        console.log("API URL:", url); // Log the API URL

        try {
          const postBody = {
            name: updatedName,
            email: updatedEmail,
            userId: selectedUser._id,
            balance: userBalance,
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
          toast.success("User Data updated");
          getUserInfo();
          // Handle the response data here
        } catch (error) {
          console.error("Error during POST request:", error);
          toast.error("Error in update");
        }

        handleModalClose();
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setErrors({ name: "", email: "", balance: "" });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />

      <div className="max-h-[60vh] w-full min-w-[90vw] overflow-auto bg-slate-100 min-h-screen p-4 shadow-lg">
        <table className="w-full shadow-lg shadow-gray">
          <thead>
            <tr>
              <th className="min-w-[10rem] rounded-tl-lg border-r border-[#F2F8F6] bg-[#181A53] px-4 py-2 text-white">
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
              <th className="min-w-[10rem] rounded-tr-md bg-[#181A53] px-4 py-3 font-[500] text-[#F2F8F6]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 bg-white">
                <td className="border-b border-r border-[#181A53] px-7 py-3 text-[1rem] font-[400] capitalize text-[#181A53]">
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      width={20}
                      height={20}
                      objectFit="center"
                      className="h-8 w-8 rounded-full object-cover object-center"
                      alt={user.name}
                      src={user.profilePicture || "/images/user/user-06.png"}
                    />
                    <p>{user.name}</p>
                  </div>
                </td>
                <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                  {user.email}
                </td>
                <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                  {user.number}
                </td>
                <td className="border-b border-r border-[#181A53] px-4 py-3 text-center text-[1rem] font-[400] capitalize text-[#181A53]">
                  {user.balance}
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <button>
                      <FaEye
                        className="cursor-pointer text-lg text-[#BDEA09]"
                        onClick={() => handleViewClick(user)}
                      />
                    </button>
                    <button
                      className="text-[#181A53] hover:underline"
                      onClick={() => handleEditClick(user)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {/* Pagination Controls */}
        {userData.length > usersPerPage && (
          <div className="mt-4 flex items-center justify-between">
            <button
              className={`rounded bg-[#BDEA09] px-4 py-2 text-[#0E0E0C] ${
                pageNo === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handlePrevPage}
              disabled={pageNo === 1}
            >
              Previous
            </button>
            <span className="font-semibold text-[#0E0E0C]">
              Page {pageNo} of {totalPages}
            </span>
            <button
              className={`rounded bg-[#BDEA09] px-4 py-2 text-[#0E0E0C] ${
                pageNo === totalPages ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handleNextPage}
              disabled={pageNo === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 z-10 flex items-center justify-center  bg-[#5f5f5f] bg-opacity-50 backdrop-blur-[2px]"
        >
          <div
            className="relative min-w-[80%] transform  rounded-[25px] bg-[#201f23] p-6 px-9 shadow-lg shadow-graydark transition-all  ease-in-out md:min-w-[30%] lg:min-w-[25%]"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <IoClose
              className=" absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09]"
              onClick={handleModalClose}
            />
            <h3 className="mb-4 text-center text-xl font-[500] text-[#F2F8F6]">
              Update User
            </h3>
            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Name
              </label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
              {errors.name && (
                <p className=" absolute -bottom-[27%] mt-1 text-sm text-red">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Email
              </label>
              <input
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
              {errors.email && (
                <p className=" absolute -bottom-[27%] mt-1 text-sm text-red">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Balance
              </label>
              <input
                type="text"
                value={userBalance}
                min={1}
                onChange={(e) => {
                  setUserBalance(Number(e.target.value));
                }}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>

            <div className="mt-3 flex  items-center justify-center gap-3 space-x-4">
              <button
                className="rounded bg-[#BDEA09] px-[40px] py-2 text-lg font-semibold text-[#0E0E0C] hover:bg-[#d2e87c]"
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
          className="fixed inset-0 z-10 flex items-center justify-center  bg-[#5f5f5f] bg-opacity-50 backdrop-blur-[2px]"
          onClick={handleOutsideClick}
        >
          <div
            className="relative min-w-[80%]  transform rounded-[25px] bg-[#201f23] p-6 px-9 shadow-md shadow-gray-2 transition-all  ease-in-out md:min-w-[30%] lg:min-w-[25%]"
            style={{ animation: "fadeIn 0.3s" }}
          >
            <IoClose
              className=" absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09]"
              onClick={() => {
                setIsViewModal(false);
              }}
            />
            <Image
              width={20}
              height={20}
              objectFit="center"
              className="mx-auto mb-4 h-12 w-12 rounded-full object-cover object-center"
              alt={user.name || "image"}
              src={user.profilePicture || "/images/user/user-06.png"}
            />
            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Email
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>

            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => {}}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>
            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Balance
              </label>
              <input
                type="email"
                value={user.balance}
                onChange={(e) => {}}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>

            <div className="relative mb-6">
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                Phone No
              </label>
              <input
                type="email"
                value={user.number}
                onChange={(e) => {}}
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
