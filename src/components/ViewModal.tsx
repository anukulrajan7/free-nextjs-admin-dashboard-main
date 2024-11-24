import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { PropertyListing } from "@/types/Properties";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { pages } from "next/dist/build/templates/app-page";

const dummyImages = [
  "https://via.placeholder.com/300x200?text=Image+1",
  "https://via.placeholder.com/300x200?text=Image+2",
  "https://via.placeholder.com/300x200?text=Image+3",
  "https://via.placeholder.com/300x200?text=Image+4",
  "https://via.placeholder.com/300x200?text=Image+5",
  "https://via.placeholder.com/300x200?text=Image+6",
];

// Carousel component
const Carousel: React.FC<{
  images: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ images, currentIndex, setCurrentIndex }) => {
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="relative mx-auto w-[70%] overflow-hidden">
      <motion.div
        className="flex"
        style={{ transform: `translateX(-${images.length * 100}%)` }}
        initial={{ x: 0 }}
        animate={{ x: `-${currentIndex * 100}%` }} // Ensure it uses percentage for correct sliding
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {images.map((image, index) => (
          <div key={index} className=" w-full flex-shrink-0">
            <Image
              width={300}
              height={300}
              objectFit="cover"
              alt={`Image ${index + 1}`}
              className="h-[7rem] w-full rounded-lg object-cover md:h-[10rem]"
              src={image || "/images/user/user-06.png"}
            />
          </div>
        ))}
      </motion.div>

      <button
        onClick={prevImage}
        className="text-gray-700 hover:bg-gray-300 absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-[#F2F2F2] p-2 transition-colors"
      >
        <BiLeftArrow />
      </button>
      <button
        onClick={nextImage}
        className="text-gray-700 hover:bg-gray-300 absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-[#F2F2F2] p-2 transition-colors"
      >
        <BiRightArrow />
      </button>
    </div>
  );
};

// ViewModal component
const ViewModal: React.FC<{
  user: PropertyListing;
  setIsViewModal: (value: boolean) => void;
  handleOutsideClick: (event: MouseEvent<HTMLDivElement>) => void;
}> = ({ user, setIsViewModal, handleOutsideClick }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fields for pagination
  const firstPageFields = 4; // 4 fields on the first page
  const subsequentPageFields = 6; // 6 fields on subsequent pages
  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Use 'short' for abbreviated month names (e.g., "Aug")
    day: "numeric",
  });

  const availableDate = new Date(user.available_from).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long", // Use 'short' for abbreviated month names (e.g., "Aug")
      day: "numeric",
    },
  );
  // All the input fields you want to show
  const inputFields = [
    { label: "Building Name", value: user.building_name },
    { label: "Address", value: user.address },
    { label: "Available From", value: availableDate },
    { label: "No of Bathroom", value: user.bathrooms },
    { label: "Owner Name", value: user.owner_name },
    { label: "Owner Phone No", value: user.owner_phone },
    { label: "Building Overview", value: user.description },
    { label: "No of Bed Room", value: user.bedrooms },
    { label: "Facilities", value: user.facilities },
    { label: "Furnish Type", value: user.furnish_type },
    { label: "Monthly Rent", value: user.monthly_rent },
    { label: "Security Deposit", value: user.security_deposit },
    { label: "Listing Type", value: user.listing_type },
    { label: "Pincode", value: user.pincode },
    { label: "Facing", value: user.facing },
    { label: "Property Posted By", value: user.property_posted_by },
    { label: "Posted On", value: formattedDate },
  ];

  // Calculate total pages for input fields
  const totalPages = Math.ceil(
    (inputFields.length - firstPageFields) / subsequentPageFields + 1,
  );

  // Get the input fields for the current page
  const displayedFields =
    currentPage === 1
      ? inputFields
      : inputFields

  // Framer-motion animation settings for modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex h-full items-center justify-center overflow-hidden bg-[#5f5f5f] bg-opacity-50 backdrop-blur-[2px]"
      onClick={handleOutsideClick}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="relative mt-10 max-h-[90%] max-w-[90%] overflow-y-auto rounded-[25px] bg-[#201f23] p-6 px-4 shadow-lg shadow-graydark transition-all ease-in-out md:max-w-[70%] md:px-9"
      >
        {/* Close Icon */}
        <IoClose
          className="absolute right-5 top-5 cursor-pointer text-[2rem] text-[#BDEA09] transition-colors hover:text-white"
          onClick={() => setIsViewModal(false)}
        />

        {/* Title */}
        <h2 className="mb-4 text-center text-[1.5rem] font-bold text-[#BDEA09]">
          Property Details
        </h2>

        {/* Carousel for images */}
        <>
          {currentPage === 1 && (
            <div className="mb-4">
              <Carousel
                images={user.images}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          )}
        </>

        {/* Display the fields */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
          {displayedFields.map((field, index) => (
            <div className="relative" key={index}>
              <label className="mb-1 block text-[.925rem] font-medium text-[#F2F8F6]">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                disabled
                className="mt-1 w-full rounded-[4px] border bg-[#F2F8F6] p-2 px-4 py-3 text-[#0E0E0C]"
              />
            </div>
          ))}
        </div>

        {/* Pagination controls for input fields */}
        {/* <div className="mt-4 flex justify-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`rounded-full px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-[#BDEA09] text-black"
                  : "bg-[#F2F8F6] text-[#0E0E0C]"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
      </motion.div>
    </div>
  );
};

export default ViewModal;
