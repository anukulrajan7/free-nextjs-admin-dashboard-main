const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = {
  signAsAdmin: baseUrl + "api/admin/signinAdmin",
  newUrl: baseUrl + "api/profile",
  getAllUsers: baseUrl + "api/admin/users",
  getUserDetails: baseUrl + "api/admin/users/",
  updateUser: baseUrl + "api/admin/users/",
  getAllPropertiesDeteails: baseUrl + "api/admin/properties",
  getPropertyDetails: baseUrl + "api/admin/properties/",
  updateProperty: baseUrl + "api/admin/properties",
  updateCoin: baseUrl + "api/admin/coins/",
};
