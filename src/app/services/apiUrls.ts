export const apiUrl = {
  adminLogin: "user/admin/login",
  adminReset: "user/admin/resetOtp",
  adminVerifyOtp: "user/admin/verifyOtp",
  adminChangePassword: "user/admin/changePassword",

  /** Dashboard */
  dashboardStats: "user/admin/stats",
  getUsers: "user/admin/getUsers",
  getDeletedUser: 'user/admin/getDeleteRequest',
  geUserById: "user/admin/get-user-by-id",
  getLoyaltyById: "/transaction/getLoyalityPointList",
  updatedUserInfo: "user/admin/updateUser",
  userResetPassword: 'user/admin/resetPassword',
  addUser: "user/admin/addUser",
  getNotification: 'user/admin/getNotification',
  getNotificationSettings: 'user/admin/getNotificationStatus',
  updateNotificationSettings: 'user/admin/updateNotificationStatus',
  getLoyaltyPointUsers: 'transaction/getLoyalityPointUsers',
  globalSearch: 'user/admin/globalSearch',

  approvedRejectDeleteRequest: 'user/admin/approveRejectDeleteRequest',

  getConfig: 'user/admin/revenueConfigs',

  // Review and Rating

  getReviewAndRatig: 'user/admin/getReview',
  updateReview: 'user/admin/review',
  replyToReview: 'user/admin/replyToReview',
  deleteReview: 'user/admin/review',
  repotedReview: 'user/admin/reportReview',

  /** SubAdmnins */
  getSubAdmins: "user/admin/getSubAdmins",
  addSubAdmin: "user/admin/addSubAdmin",
  getSubAdminById: "user/admin/getSubAdminById",
  updateSubAdminById: "user/admin/updateSubAdmin",

  /**Roles */
  getAdminRoles: "user/admin/getRoles",

  /** Permission */
  getPermissions: "user/admin/getPermissionsMenus",

  /**Permission menus*/
  getPermissionMenus: "user/admin/getPermissionsMenus",

  /**Reject user Profile by admin*/
  rejectUserProfile: "user/admin/rejectByAdmin",


  /** SpecialDayUrls */
  addSpecialDay: 'user/admin/specialDay',
  // listSpecialDay: 'user/admin/specialDay',
  // updateSpecialDay: 'user/admin/specialDay',
  changeStatusSpecialDay: 'user/admin/specialDay/changeStatus',
  deleteSpecialDay: 'user/admin/deleteSpecialDay',


  /**Approved user Profile by admin*/
  approvedUserProfile: "user/admin/approveByAdmin",

  /**Reject user Profile by admin*/
  rejectMerchantByAdmin: "user/admin/rejectMerchantByAdmin",

  /**Approved user Profile by admin*/
  approvedMerchantByAdmin: "user/admin/approveMerchantByAdmin",

  /** Push notification */
  sendNotification: "user/admin/sendNotification",

  recentTransaction: 'transaction/transactionList',
  transactionDetails: 'transaction/details',
  loyaltyPointListById: 'transaction/getLoyalityPointList',

  loyaltyPointList: 'transaction/getLoyalityPointUsers',
  /** get merchant list */
  getMerchant: "user/admin/merchantAndBusiness/getMerchants",

  /** get merchant list by id */
  getMerchantById: "user/admin/merchantAndBusiness/getMerchantById",

  /** get merchant active and inactive */
  merchantActiveInactive: "user/admin/merchantAndBusiness/updateMerchant",

  merchantDashboardStats: "user/admin/merchantAndBusiness/merchantStats",

  //  get category list 
  getCategory: "user/admin/merchantAndBusiness/getCategories?",

  //  get category by id
  getCategoryById: "user/admin/merchantAndBusiness/createCategory",

  //  get category by id
  updateCategory: "user/admin/merchantAndBusiness/updateCategory",

  createCategory: "user/admin/merchantAndBusiness/createCategory",

  getBusinessessOnboarding: 'user/admin/merchantAndBusiness/getBusiness?',

  getMerchantOnboardingBusinessById: 'user/merchant/getBusinessById?',

  updateBusiness: 'user/merchant/updateBusiness',

  approvedBusiness: 'user/admin/merchantAndBusiness/approveBusinessByAdmin',

  rejectBusiness: 'user/admin/merchantAndBusiness/rejectBusinessByAdmin',

  getSettlement: 'user/admin/getSettlement',

  getMerchantSettlement: 'user/admin/getPendingPayment',

  signupOnboardingLogo: "integration/user/customer/upload/profilePic",

  singleMarkComplete: 'user/admin/markCompleted',

  singleAutoDeduct: 'user/admin/autoDebited',

  settlementWidrawal: 'user/admin/getWithdrawalRequest',

  addCMS: 'user/admin/createCMS',

  getCMS: 'user/admin/getCMS',

  activeInactive: 'user/admin/activateCMS',

  updateCMS: 'user/admin/updateCMS',


  deleteCMS: 'user/admin/deleteCMS',

  getCMSBYId: 'user/admin/getCMSById',

  withdrowelApprovedByAdmin: 'user/admin/withdrawalApproveByAdmin',
  adminPermissionCheck: 'user/merchant/callEverywhereToGetStatus',


  /**
   * Customer API ENDPOINTS 
   */

  getCustomerList: "user/admin/getUsers",
  getCustomerById: "user/admin/getCustomerById",

  /**
   * Vehicle API ENDPOINTS 
   */
  brandList: "user/admin/vehicle/brand/list",
  getBrandById: "user/admin/vehicle/brand/detail",
  addBrand: "user/admin/vehicle/brand",
  editBrand: "user/admin/vehicle/brand",
  changeBrandStatus: "user/admin/vehicle/brand/changeStatus",
  deleteBrand: "user/admin/vehicle/brand/delete",

  modelList: "user/admin/vehicle/model/list",
  getModelById: "user/admin/vehicle/model/detail",
  addModel: "user/admin/vehicle/model",
  editModel: "user/admin/vehicle/model",
  changeModelStatus: "user/admin/vehicle/model/changeStatus",
  deleteModel: "user/admin/vehicle/model/delete",


  /**
   *Vehicle List 
   */
   getVehicleList:'user/admin/vehicle/list',
   getVehicleDetails:'/user/admin/vehicle/details',
   vehicleAproveReject:'/user/admin/vehicle/aproveRejectByAdmin',


  /** 
   * Host End Points
  */

  getHostList: 'user/admin/hostList',
  getHostById: 'user/admin/getHostById',
  approvedHost: 'user/admin/approveHostByAdmin',
  rejectHost: 'user/admin/rejectHostByAdmin',

};
