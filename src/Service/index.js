const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = {
  signAsAdmin: baseUrl + "api/admin/signinAdmin",
  newUrl: baseUrl + "api/profile",
  getAllUsers: baseUrl + "api/admin/users",
  getUserDetails: baseUrl + "api/admin/users/",
  getUserDetail: baseUrl + "api/profile",
  updateUser: baseUrl + "api/admin/updateUser",
  getAllPropertiesDeteails: baseUrl + "api/admin/properties",
  getPropertyDetails: baseUrl + "api/admin/properties/",
  updateProperty: baseUrl + "api/admin/updateProperties",
  updateCoin: baseUrl + "api/admin/coins/",
  dashboard: baseUrl + "api/admin/dashboard",
};
