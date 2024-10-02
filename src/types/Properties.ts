export type PropertyListing = {
    location: {
        latitude: number;
        longitude: number;
    };
    _id: string;
    listing_type: 'rent' | 'sale';
    owner_name: string;
    owner_phone: number;
    property_type: 'Residential' | 'Commercial'; // Add more types if needed
    title: string;
    description: string;
    address: string;
    pincode: string;
    building_name: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    property_age: string;
    facing: 'north' | 'south' | 'east' | 'west'; // Add more directions if needed
    floor_number: number;
    total_floors: number;
    furnish_type: 'Fully Furnished' | 'Partially Furnished' | 'Unfurnished'; // Add more types if needed
    available_from: string; // Consider using Date if parsing
    monthly_rent: number;
    security_deposit: number;
    preferred_tenant: 'Any' | 'Family' | 'Bachelors'; // Add more tenant types if needed
    localities: string[]; // Array of locality names
    landmark: string;
    facilities: string[]; // Array of facility names
    images: string[]; // Array of image URLs
    createdAt: string; // Consider using Date if parsing
    updatedAt: string;
    property_posted_by: "agent" | "owner";
    property_subtype: string;
    // Consider using Date if parsing
    __v: number;
}

export type PropertyListings = PropertyListing[];