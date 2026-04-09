import axios from 'axios';
import { DEMO_MODE } from './demoConfig';

const API_HOST = 'https://demo.local';
const PROVINCES_HOST = 'provinces.open-api.vn';

const clone = (value) => JSON.parse(JSON.stringify(value));

const nowIso = () => new Date().toISOString();

const addDays = (days, hour = 8, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const ok = (data, status = 200) => ({
  data: clone(data),
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

const errorResponse = (status, message, extra = {}) =>
  Promise.reject({
    response: {
      data: { message, ...extra },
      status,
      statusText: 'Error',
      headers: {},
      config: {},
    },
    message,
    isAxiosError: true,
  });

const parseBody = (body) => {
  if (!body) return {};
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return Object.fromEntries(body.entries());
  }
  return body;
};

const getUrl = (rawUrl, params = {}) => {
  const url = new URL(rawUrl, API_HOST);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url;
};

const demoProvinceData = {
  provinces: [
    { code: 1, name: 'Hà Nội' },
    { code: 79, name: 'TP. Hồ Chí Minh' },
    { code: 48, name: 'Đà Nẵng' },
  ],
  provinceDetails: {
    1: {
      code: 1,
      name: 'Hà Nội',
      districts: [
        { code: 101, name: 'Cầu Giấy', wards: [{ code: 10101, name: 'Dịch Vọng' }, { code: 10102, name: 'Nghĩa Tân' }] },
        { code: 102, name: 'Nam Từ Liêm', wards: [{ code: 10201, name: 'Mỹ Đình 1' }, { code: 10202, name: 'Mễ Trì' }] },
      ],
    },
    79: {
      code: 79,
      name: 'TP. Hồ Chí Minh',
      districts: [
        { code: 7901, name: 'Quận 7', wards: [{ code: 790101, name: 'Tân Phú' }, { code: 790102, name: 'Tân Hưng' }] },
        { code: 7902, name: 'Thủ Đức', wards: [{ code: 790201, name: 'Linh Tây' }, { code: 790202, name: 'Hiệp Bình Chánh' }] },
      ],
    },
    48: {
      code: 48,
      name: 'Đà Nẵng',
      districts: [{ code: 4801, name: 'Hải Châu', wards: [{ code: 480101, name: 'Hòa Thuận Tây' }, { code: 480102, name: 'Thanh Bình' }] }],
    },
  },
};

const baseUsers = {
  workerDemo: {
    id: 'worker-demo',
    fullName: 'Nguyễn Thảo Vy',
    name: 'Nguyễn Thảo Vy',
    phone: '0900000001',
    email: 'thaovy.demo@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'worker',
    isGuest: false,
    hasPremiumAccess: false,
    premiumExpiry: null,
    phoneVerified: true,
    phoneVerifiedAt: addDays(-5),
    phoneVerificationChannel: 'ZaloOA',
    gender: 1,
    dateOfBirth: '1998-07-18T00:00:00.000Z',
    additionalInfo: JSON.stringify({
      provinceCode: 79,
      provinceName: 'TP. Hồ Chí Minh',
      districtCode: 7902,
      districtName: 'Thủ Đức',
      wardCode: 790201,
      wardName: 'Linh Tây',
      detailedAddress: '124 Đường số 6',
    }),
    workerProfile: {
      bio: 'Tôi có 4 năm kinh nghiệm giúp việc theo giờ, chăm bé và nấu ăn gia đình. Phong cách làm việc kỹ, gọn gàng và đúng giờ.',
      desiredJobTitle: 'Giúp việc theo giờ / chăm bé ban ngày',
      seekingDescription: 'Ưu tiên ca sáng hoặc ca chiều tại Thủ Đức, Quận 7, Bình Thạnh. Có thể nhận việc cuối tuần nếu báo trước.',
      experienceYears: 4,
      hourlyRate: 85000,
      desiredServiceCategories: JSON.stringify(['Housekeeping', 'Babysitting', 'Cooking']),
      preferredLocations: JSON.stringify(['Thủ Đức', 'Quận 7', 'Bình Thạnh']),
      skills: JSON.stringify(['Dọn dẹp kỹ', 'Nấu ăn gia đình', 'Chăm bé từ 2 tuổi', 'Ủi đồ', 'Sắp xếp nhà cửa']),
      isProfilePublic: true,
    },
    updatedAt: addDays(-1),
  },
  employerDemo: {
    id: 'employer-demo',
    fullName: 'Trần Minh Khang',
    name: 'Trần Minh Khang',
    phone: '0900000002',
    email: 'khang.demo@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'employer',
    isGuest: false,
    hasPremiumAccess: true,
    premiumExpiry: addDays(30),
    phoneVerified: true,
    phoneVerifiedAt: addDays(-10),
    phoneVerificationChannel: 'SMS',
    gender: 0,
    dateOfBirth: '1990-03-11T00:00:00.000Z',
    additionalInfo: JSON.stringify({
      provinceCode: 79,
      provinceName: 'TP. Hồ Chí Minh',
      districtCode: 7901,
      districtName: 'Quận 7',
      wardCode: 790101,
      wardName: 'Tân Phú',
      detailedAddress: 'Sunrise City, Nguyễn Hữu Thọ',
    }),
    workerProfile: null,
    updatedAt: addDays(-2),
  },
  adminDemo: {
    id: 'admin-demo',
    fullName: 'Lê Quỳnh Anh',
    name: 'Lê Quỳnh Anh',
    phone: '0900000003',
    email: 'admin.demo@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    isGuest: false,
    hasPremiumAccess: true,
    premiumExpiry: addDays(365),
    phoneVerified: true,
    phoneVerifiedAt: addDays(-20),
    phoneVerificationChannel: 'Admin',
    gender: 1,
    dateOfBirth: '1992-10-09T00:00:00.000Z',
    additionalInfo: JSON.stringify({
      provinceCode: 1,
      provinceName: 'Hà Nội',
      districtCode: 101,
      districtName: 'Cầu Giấy',
      wardCode: 10101,
      wardName: 'Dịch Vọng',
      detailedAddress: 'Tòa nhà điều hành demo',
    }),
    workerProfile: null,
    updatedAt: addDays(-1),
  },
};

const extraWorkers = {
  workerAlt1: {
    id: 'worker-alt-1',
    fullName: 'Phạm Mai Hương',
    phone: '0900000011',
    email: 'mai.huong@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    role: 'worker',
    isGuest: false,
    hasPremiumAccess: false,
    premiumExpiry: null,
    phoneVerified: true,
    phoneVerifiedAt: addDays(-12),
    phoneVerificationChannel: 'ZaloOA',
    gender: 1,
    dateOfBirth: '1995-01-05T00:00:00.000Z',
    additionalInfo: JSON.stringify({
      provinceCode: 79,
      provinceName: 'TP. Hồ Chí Minh',
      districtCode: 7901,
      districtName: 'Quận 7',
      wardCode: 790102,
      wardName: 'Tân Hưng',
      detailedAddress: 'Nguyễn Thị Thập',
    }),
    workerProfile: {
      bio: 'Chuyên giúp việc căn hộ, chăm trẻ bán thời gian và dọn nhà cuối tuần.',
      desiredJobTitle: 'Giúp việc căn hộ / trông trẻ',
      seekingDescription: 'Nhận việc tại Quận 7, Nhà Bè, Quận 4. Có thể tăng ca tối.',
      experienceYears: 5,
      hourlyRate: 90000,
      desiredServiceCategories: JSON.stringify(['Housekeeping', 'Babysitting']),
      preferredLocations: JSON.stringify(['Quận 7', 'Nhà Bè', 'Quận 4']),
      skills: JSON.stringify(['Dọn căn hộ', 'Giữ trẻ', 'Nấu ăn cơ bản']),
      isProfilePublic: true,
    },
    updatedAt: addDays(-1),
  },
  workerAlt2: {
    id: 'worker-alt-2',
    fullName: 'Đỗ Thành Nam',
    phone: '0900000012',
    email: 'thanh.nam@gmail.com',
    avatarUrl: '',
    role: 'worker',
    isGuest: false,
    hasPremiumAccess: false,
    premiumExpiry: null,
    phoneVerified: true,
    phoneVerifiedAt: addDays(-15),
    phoneVerificationChannel: 'SMS',
    gender: 0,
    dateOfBirth: '1993-09-14T00:00:00.000Z',
    additionalInfo: JSON.stringify({
      provinceCode: 48,
      provinceName: 'Đà Nẵng',
      districtCode: 4801,
      districtName: 'Hải Châu',
      wardCode: 480101,
      wardName: 'Hòa Thuận Tây',
      detailedAddress: 'Lê Đình Lý',
    }),
    workerProfile: {
      bio: 'Có kinh nghiệm chăm người cao tuổi và hỗ trợ di chuyển trong gia đình.',
      desiredJobTitle: 'Chăm sóc người cao tuổi',
      seekingDescription: 'Ưu tiên các ca dài ngày hoặc cố định tại trung tâm Đà Nẵng.',
      experienceYears: 6,
      hourlyRate: 110000,
      desiredServiceCategories: JSON.stringify(['ElderCare']),
      preferredLocations: JSON.stringify(['Hải Châu', 'Thanh Khê']),
      skills: JSON.stringify(['Chăm người bệnh', 'Hỗ trợ vận động', 'Theo dõi thuốc']),
      isProfilePublic: true,
    },
    updatedAt: addDays(-3),
  },
};

const initialJobs = [
  {
    id: 'job-101',
    employerId: 'employer-demo',
    employerName: 'Trần Minh Khang',
    employerAvatarUrl: baseUsers.employerDemo.avatarUrl,
    title: 'Cần người giúp việc căn hộ 3 phòng ngủ buổi sáng',
    description: 'Căn hộ 3 phòng ngủ cần dọn dẹp tổng thể 3 buổi/tuần.\nƯu tiên người gọn gàng, biết sắp xếp đồ dùng.\nNếu phù hợp có thể làm lâu dài.',
    location: 'Sunrise City, Quận 7, TP. Hồ Chí Minh',
    price: 85000,
    status: 0,
    timingType: 1,
    serviceCategory: 0,
    postType: 0,
    preferredGender: 0,
    targetAgeRange: '23-45',
    requiredSkills: ['Dọn dẹp kỹ', 'Sắp xếp nhà cửa', 'Ủi đồ'],
    workDate: addDays(2, 8, 0),
    workStartTime: '08:00',
    workEndTime: '11:00',
    workingTimeDescription: 'Thứ 2 - 4 - 6 | 08:00 - 11:00',
    createdAt: addDays(-1, 10, 30),
    updatedAt: addDays(-1, 10, 30),
  },
  {
    id: 'job-102',
    employerId: 'employer-demo',
    employerName: 'Trần Minh Khang',
    employerAvatarUrl: baseUsers.employerDemo.avatarUrl,
    title: 'Chăm bé 4 tuổi sau giờ học tại Quận 7',
    description: 'Đón bé từ trường về nhà, hỗ trợ ăn nhẹ và chơi cùng bé đến khi phụ huynh đi làm về.\nCần người yêu trẻ, giao tiếp nhẹ nhàng.',
    location: 'Phú Mỹ Hưng, Quận 7, TP. Hồ Chí Minh',
    price: 95000,
    status: 0,
    timingType: 1,
    serviceCategory: 1,
    postType: 0,
    preferredGender: 1,
    targetAgeRange: '25-40',
    requiredSkills: ['Trông trẻ', 'Kể chuyện', 'Chuẩn bị bữa nhẹ'],
    workDate: addDays(3, 15, 30),
    workStartTime: '15:30',
    workEndTime: '19:00',
    workingTimeDescription: 'Thứ 2 - 6 | 15:30 - 19:00',
    createdAt: addDays(-2, 9, 0),
    updatedAt: addDays(-2, 9, 0),
  },
  {
    id: 'job-103',
    employerId: 'other-employer',
    employerName: 'Nguyễn Gia Hân',
    employerAvatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
    title: 'Nấu ăn gia đình 5 ngày/tuần tại Thủ Đức',
    description: 'Gia đình 4 người cần người chuẩn bị bữa tối từ thứ 2 đến thứ 6.\nBiết lên thực đơn là lợi thế.',
    location: 'Linh Tây, Thủ Đức, TP. Hồ Chí Minh',
    price: 120000,
    status: 0,
    timingType: 1,
    serviceCategory: 3,
    postType: 0,
    preferredGender: 0,
    targetAgeRange: '22-50',
    requiredSkills: ['Nấu ăn gia đình', 'Đi chợ', 'Sơ chế thực phẩm'],
    workDate: addDays(1, 16, 0),
    workStartTime: '16:00',
    workEndTime: '19:00',
    workingTimeDescription: 'Thứ 2 - 6 | 16:00 - 19:00',
    createdAt: addDays(-1, 7, 0),
    updatedAt: addDays(-1, 7, 0),
  },
  {
    id: 'job-104',
    employerId: 'other-employer-2',
    employerName: 'Đặng Hữu Nghĩa',
    employerAvatarUrl: '',
    title: 'Chăm sóc người cao tuổi tại nhà ở Đà Nẵng',
    description: 'Cần người chăm ông 72 tuổi còn đi lại được.\nHỗ trợ ăn uống, nhắc thuốc và trò chuyện.',
    location: 'Hải Châu, Đà Nẵng',
    price: 8500000,
    status: 0,
    timingType: 0,
    serviceCategory: 2,
    postType: 0,
    preferredGender: 0,
    targetAgeRange: '30-55',
    requiredSkills: ['Chăm người lớn tuổi', 'Theo dõi thuốc'],
    workDate: addDays(5, 7, 0),
    workStartTime: '07:00',
    workEndTime: '19:00',
    workingTimeDescription: 'Ở lại theo tháng',
    createdAt: addDays(-4, 8, 30),
    updatedAt: addDays(-4, 8, 30),
  },
];

const initialApplications = [
  {
    id: 'app-201',
    jobId: 'job-101',
    applicantId: 'worker-demo',
    applicantName: 'Nguyễn Thảo Vy',
    applicantAvatarUrl: baseUsers.workerDemo.avatarUrl,
    applicantPhone: baseUsers.workerDemo.phone,
    applicantEmail: baseUsers.workerDemo.email,
    jobTitle: 'Cần người giúp việc căn hộ 3 phòng ngủ buổi sáng',
    jobPrice: 85000,
    message: 'Em có 4 năm kinh nghiệm dọn căn hộ chung cư, làm việc kỹ và đúng giờ. Có thể nhận lịch cố định 3 buổi/tuần.',
    bidPrice: 88000,
    appliedAt: addDays(-1, 12, 15),
    availableStartDate: addDays(2, 0, 0).slice(0, 10),
    status: 1,
    isAccepted: true,
    cvUrl: 'https://example.com/demo-cv-thaovy.pdf',
  },
  {
    id: 'app-202',
    jobId: 'job-102',
    applicantId: 'worker-demo',
    applicantName: 'Nguyễn Thảo Vy',
    applicantAvatarUrl: baseUsers.workerDemo.avatarUrl,
    applicantPhone: baseUsers.workerDemo.phone,
    applicantEmail: baseUsers.workerDemo.email,
    jobTitle: 'Chăm bé 4 tuổi sau giờ học tại Quận 7',
    jobPrice: 95000,
    message: 'Em từng trông bé 3-6 tuổi bán thời gian, có thể hỗ trợ kể chuyện và cho bé ăn nhẹ sau giờ học.',
    bidPrice: 95000,
    appliedAt: addDays(-1, 16, 30),
    availableStartDate: addDays(3, 0, 0).slice(0, 10),
    status: 0,
    isAccepted: false,
    cvUrl: '[Processing...]',
  },
  {
    id: 'app-203',
    jobId: 'job-101',
    applicantId: 'worker-alt-1',
    applicantName: 'Phạm Mai Hương',
    applicantAvatarUrl: extraWorkers.workerAlt1.avatarUrl,
    applicantPhone: extraWorkers.workerAlt1.phone,
    applicantEmail: extraWorkers.workerAlt1.email,
    jobTitle: 'Cần người giúp việc căn hộ 3 phòng ngủ buổi sáng',
    jobPrice: 85000,
    message: 'Mình có thể nhận ca sáng cố định và từng làm ở Phú Mỹ Hưng hơn 2 năm.',
    bidPrice: 90000,
    appliedAt: addDays(-1, 11, 0),
    availableStartDate: addDays(2, 0, 0).slice(0, 10),
    status: 0,
    isAccepted: false,
    cvUrl: 'https://example.com/demo-cv-maihuong.pdf',
  },
  {
    id: 'app-204',
    jobId: 'job-102',
    applicantId: 'worker-alt-2',
    applicantName: 'Đỗ Thành Nam',
    applicantAvatarUrl: '',
    applicantPhone: extraWorkers.workerAlt2.phone,
    applicantEmail: extraWorkers.workerAlt2.email,
    jobTitle: 'Chăm bé 4 tuổi sau giờ học tại Quận 7',
    jobPrice: 95000,
    message: 'Tôi phù hợp với việc đưa đón và trông trẻ buổi chiều, có kinh nghiệm kèm học lớp 1.',
    bidPrice: 98000,
    appliedAt: addDays(-2, 14, 0),
    availableStartDate: addDays(4, 0, 0).slice(0, 10),
    status: 2,
    isAccepted: false,
    cvUrl: 'https://example.com/demo-cv-thanhnam.pdf',
  },
];

const initialMatches = {
  'job-101': [
    { workerId: 'worker-alt-1', fullName: 'Phạm Mai Hương', avatarUrl: extraWorkers.workerAlt1.avatarUrl, averageRating: 4.9, reviewCount: 24, matchScore: 96, distanceKm: 2.1, experienceYears: 5, hourlyRate: 90000, matchedSkills: ['Dọn căn hộ', 'Ủi đồ', 'Sắp xếp nhà cửa'] },
    { workerId: 'worker-demo', fullName: 'Nguyễn Thảo Vy', avatarUrl: baseUsers.workerDemo.avatarUrl, averageRating: 4.8, reviewCount: 18, matchScore: 93, distanceKm: 4.3, experienceYears: 4, hourlyRate: 85000, matchedSkills: ['Dọn dẹp kỹ', 'Sắp xếp nhà cửa'] },
  ],
  'job-102': [
    { workerId: 'worker-demo', fullName: 'Nguyễn Thảo Vy', avatarUrl: baseUsers.workerDemo.avatarUrl, averageRating: 4.8, reviewCount: 18, matchScore: 91, distanceKm: 4.6, experienceYears: 4, hourlyRate: 85000, matchedSkills: ['Trông trẻ', 'Chuẩn bị bữa nhẹ'] },
  ],
};

const initialNotifications = {
  'worker-demo': [
    { id: 'n1', title: 'Tin của bạn được chấp nhận', message: 'Chủ nhà đã chấp nhận hồ sơ cho công việc giúp việc căn hộ sáng.', createdAt: addDays(-1, 13, 0), isRead: false, link: '/dashboard/viec-da-ung-tuyen' },
    { id: 'n2', title: 'Lịch làm việc mới', message: 'Bạn có lịch làm việc vào 08:00 ngày mai tại Quận 7.', createdAt: addDays(-1, 18, 0), isRead: false, link: '/dashboard/lich-lam-viec' },
  ],
  'employer-demo': [
    { id: 'n3', title: 'Có ứng viên mới', message: 'Nguyễn Thảo Vy vừa ứng tuyển vào tin chăm bé 4 tuổi.', createdAt: addDays(-1, 16, 40), isRead: false, link: '/ung-tuyen-viec-lam/job-102' },
    { id: 'n4', title: 'Matching hoàn tất', message: 'Hệ thống đã gợi ý 2 ứng viên phù hợp cho tin giúp việc căn hộ.', createdAt: addDays(-1, 10, 0), isRead: true, link: '/ung-tuyen-viec-lam/job-101' },
  ],
  'admin-demo': [
    { id: 'n5', title: 'Có báo cáo mới', message: 'Một phản hồi tiêu cực cần admin xem xét trong ngày.', createdAt: addDays(-1, 9, 0), isRead: false, link: '/dashboard/tong-quan' },
  ],
};

const initialDb = {
  users: { ...baseUsers, ...extraWorkers },
  jobs: clone(initialJobs),
  applications: clone(initialApplications),
  matches: clone(initialMatches),
  notifications: clone(initialNotifications),
  auth: {
    '0900000001': { password: 'demo123', userKey: 'workerDemo' },
    '0900000002': { password: 'demo123', userKey: 'employerDemo' },
    '0900000003': { password: 'demo123', userKey: 'adminDemo' },
  },
};

let db = clone(initialDb);
let guestSequence = 1;
let jobSequence = 1000;
let appSequence = 5000;

const resetDb = () => {
  db = clone(initialDb);
  guestSequence = 1;
  jobSequence = 1000;
  appSequence = 5000;
};

const normalizeRoleCode = (role) => {
  if (role === 'admin') return 0;
  if (role === 'worker') return 2;
  return 1;
};

const createAuthPayload = (user) => ({
  token: `demo-token-${user.id}`,
  userId: user.id,
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  role: normalizeRoleCode(user.role),
  isGuest: user.isGuest,
  hasPremiumAccess: user.hasPremiumAccess,
  premiumExpiry: user.premiumExpiry,
  avatarUrl: user.avatarUrl,
  phoneVerified: user.phoneVerified,
  phoneVerifiedAt: user.phoneVerifiedAt,
  phoneVerificationChannel: user.phoneVerificationChannel,
});

const getToken = (config = {}) => {
  const authHeader = config?.headers?.Authorization || config?.headers?.authorization;
  if (!authHeader) return localStorage.getItem('token');
  return String(authHeader).replace(/^Bearer\s+/i, '');
};

const getCurrentUser = (config = {}) => {
  const token = getToken(config);
  if (!token) return null;
  const userId = token.replace('demo-token-', '');
  return Object.values(db.users).find((user) => user.id === userId) || null;
};

const getWorkerSummary = (user) => {
  const additionalInfo = JSON.parse(user.additionalInfo || '{}');
  const profile = user.workerProfile || {};
  const preferredLocations = JSON.parse(profile.preferredLocations || '[]');
  const skills = JSON.parse(profile.skills || '[]');
  return {
    id: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    verified: user.phoneVerified,
    desiredJobTitle: profile.desiredJobTitle || '',
    locationSummary: preferredLocations.join(', ') || additionalInfo.districtName || additionalInfo.provinceName || '',
    experienceYears: profile.experienceYears || 0,
    hourlyRate: profile.hourlyRate || 0,
    skills,
    seekingDescription: profile.seekingDescription || '',
    desiredServiceCategories: JSON.parse(profile.desiredServiceCategories || '[]'),
    preferredLocations,
    bio: profile.bio || '',
    age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : null,
    phone: user.phone,
    email: user.email,
    isProfilePublic: Boolean(profile.isProfilePublic),
    updatedAt: user.updatedAt || nowIso(),
  };
};

const getJobById = (jobId) => db.jobs.find((job) => String(job.id) === String(jobId));

const getApplicationById = (applicationId) => db.applications.find((app) => String(app.id) === String(applicationId));

const getEmployerJobs = (userId) =>
  db.jobs
    .filter((job) => job.employerId === userId)
    .map((job) => ({ ...job, applicantCount: db.applications.filter((app) => app.jobId === job.id).length }));

const getWorkerApplications = (userId) =>
  db.applications
    .filter((app) => app.applicantId === userId)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

const getEmployerApplications = (userId) => {
  const jobIds = new Set(db.jobs.filter((job) => job.employerId === userId).map((job) => job.id));
  return db.applications.filter((app) => jobIds.has(app.jobId)).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

const getWorkerSchedule = (userId) =>
  db.applications
    .filter((app) => app.applicantId === userId && app.status === 1)
    .map((app) => getJobById(app.jobId))
    .filter(Boolean)
    .map((job) => ({
      id: job.id,
      title: job.title,
      createdAt: job.workDate || job.createdAt,
      location: job.location,
      employerName: job.employerName,
      workingTimeDescription: job.workingTimeDescription,
    }));

const createJob = (payload, currentUser) => {
  const newJob = {
    id: `job-${jobSequence++}`,
    employerId: currentUser.id,
    employerName: currentUser.fullName,
    employerAvatarUrl: currentUser.avatarUrl,
    title: payload.title,
    description: payload.description,
    location: payload.location,
    price: Number(payload.price || 0),
    status: 0,
    timingType: payload.timingType ?? 1,
    serviceCategory: payload.serviceCategory ?? 0,
    postType: payload.postType ?? 0,
    preferredGender: payload.preferredGender ?? 0,
    targetAgeRange: payload.targetAgeRange || '20-55',
    requiredSkills: payload.requiredSkills || [],
    workDate: payload.workDate || null,
    workStartTime: payload.workStartTime || '',
    workEndTime: payload.workEndTime || '',
    workingTimeDescription: payload.workingTimeDescription || '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  db.jobs.unshift(newJob);
  db.matches[newJob.id] = [
    { workerId: 'worker-demo', fullName: baseUsers.workerDemo.fullName, avatarUrl: baseUsers.workerDemo.avatarUrl, averageRating: 4.8, reviewCount: 18, matchScore: 94, distanceKm: 3.8, experienceYears: 4, hourlyRate: 85000, matchedSkills: newJob.requiredSkills.slice(0, 3) },
    { workerId: 'worker-alt-1', fullName: extraWorkers.workerAlt1.fullName, avatarUrl: extraWorkers.workerAlt1.avatarUrl, averageRating: 4.9, reviewCount: 24, matchScore: 89, distanceKm: 5.1, experienceYears: 5, hourlyRate: 90000, matchedSkills: newJob.requiredSkills.slice(0, 2) },
  ];
  db.notifications[currentUser.id] = db.notifications[currentUser.id] || [];
  db.notifications[currentUser.id].unshift({
    id: `n-job-${newJob.id}`,
    title: 'Tin đăng mới đã được tạo',
    message: `Tin "${newJob.title}" đã sẵn sàng để nhận ứng viên.`,
    createdAt: nowIso(),
    isRead: false,
    link: `/ung-tuyen-viec-lam/${newJob.id}`,
  });
  return newJob;
};

const filterWorkers = (searchParams) => {
  const keyword = String(searchParams.get('keyword') || '').toLowerCase();
  const location = String(searchParams.get('location') || '').toLowerCase();
  const serviceCategory = String(searchParams.get('serviceCategory') || '');
  return Object.values(db.users)
    .filter((user) => user.role === 'worker' && user.workerProfile?.isProfilePublic)
    .map(getWorkerSummary)
    .filter((worker) => {
      const inKeyword =
        !keyword ||
        worker.fullName.toLowerCase().includes(keyword) ||
        worker.desiredJobTitle.toLowerCase().includes(keyword) ||
        worker.skills.some((skill) => skill.toLowerCase().includes(keyword));
      const inLocation = !location || worker.locationSummary.toLowerCase().includes(location);
      const inCategory = !serviceCategory || worker.desiredServiceCategories.includes(serviceCategory);
      return inKeyword && inLocation && inCategory;
    });
};

const shouldMock = (url) =>
  DEMO_MODE &&
  typeof url === 'string' &&
  (url.includes('localhost:7004') || url.startsWith('/api/') || url.includes(PROVINCES_HOST));

const handleProvinceRequest = (url) => {
  const parsed = new URL(url, API_HOST);
  if (parsed.hostname !== PROVINCES_HOST) return null;
  if (parsed.pathname === '/api/v2/') return ok(demoProvinceData.provinces);
  const provinceMatch = parsed.pathname.match(/^\/api\/p\/(\d+)$/);
  if (provinceMatch) return ok(demoProvinceData.provinceDetails[provinceMatch[1]] || {});
  const districtMatch = parsed.pathname.match(/^\/api\/d\/(\d+)$/);
  if (districtMatch) {
    const districtCode = districtMatch[1];
    const province = Object.values(demoProvinceData.provinceDetails).find((item) =>
      item.districts.some((district) => String(district.code) === districtCode)
    );
    return ok(province?.districts.find((district) => String(district.code) === districtCode) || {});
  }
  return null;
};

const handleAuthRoutes = async (method, path, body) => {
  if (method === 'post' && path === '/api/auth/login') {
    const record = db.auth[body.phone];
    if (!record || record.password !== body.password) {
      return errorResponse(401, 'Tài khoản demo không đúng. Hãy dùng số điện thoại và mật khẩu demo.');
    }
    return ok(createAuthPayload(db.users[record.userKey]));
  }

  if (method === 'post' && path === '/api/auth/send-otp') {
    return ok({ message: 'Mã OTP demo là 123456.' });
  }

  if (method === 'post' && path === '/api/auth/register') {
    return ok({ message: 'Đăng ký demo thành công. Bạn có thể dùng ngay tài khoản demo có sẵn.' }, 201);
  }

  if (method === 'post' && path === '/api/auth/guest-checkout') {
    const guestId = `guest-${guestSequence++}`;
    const guestUser = {
      id: guestId,
      fullName: body.fullName,
      name: body.fullName,
      phone: body.phone,
      email: '',
      avatarUrl: '',
      role: 'employer',
      isGuest: true,
      hasPremiumAccess: false,
      premiumExpiry: null,
      phoneVerified: false,
      phoneVerifiedAt: null,
      phoneVerificationChannel: null,
      gender: 0,
      dateOfBirth: null,
      additionalInfo: JSON.stringify({}),
      workerProfile: null,
      updatedAt: nowIso(),
    };
    db.users[guestId] = guestUser;
    return ok(createAuthPayload(guestUser), 201);
  }

  return null;
};

const handleJobRoutes = async (method, path, config, body) => {
  const currentUser = getCurrentUser(config);

  if (method === 'get' && path === '/api/job/available') {
    return ok(db.jobs.filter((job) => job.status === 0));
  }

  if (method === 'get' && path === '/api/job/my-jobs') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập để xem tin đã đăng.');
    return ok(getEmployerJobs(currentUser.id));
  }

  if (method === 'get' && path === '/api/job/my-applications') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập để xem dữ liệu.');
    return ok(currentUser.role === 'employer' ? getEmployerApplications(currentUser.id) : getWorkerApplications(currentUser.id));
  }

  if (method === 'post' && path === '/api/job') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập để đăng tin.');
    return ok(createJob(body, currentUser), 201);
  }

  const applyMatch = path.match(/^\/api\/job\/([^/]+)\/apply$/);
  if (method === 'post' && applyMatch) {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập để ứng tuyển.');
    const job = getJobById(applyMatch[1]);
    if (!job) return errorResponse(404, 'Không tìm thấy công việc.');
    const existed = db.applications.find((app) => app.jobId === job.id && app.applicantId === currentUser.id);
    if (existed) return errorResponse(400, 'Bạn đã ứng tuyển công việc này rồi.');
    const app = {
      id: `app-${appSequence++}`,
      jobId: job.id,
      applicantId: currentUser.id,
      applicantName: currentUser.fullName,
      applicantAvatarUrl: currentUser.avatarUrl,
      applicantPhone: currentUser.phone,
      applicantEmail: currentUser.email,
      jobTitle: job.title,
      jobPrice: job.price,
      message: body.Message || body.message || '',
      bidPrice: Number(body.BidPrice || body.bidPrice || job.price),
      appliedAt: nowIso(),
      availableStartDate: body.AvailableStartDate || body.availableStartDate || null,
      status: 0,
      isAccepted: false,
      cvUrl: body.Cv ? '[Processing...]' : '',
    };
    db.applications.unshift(app);
    db.notifications[job.employerId] = db.notifications[job.employerId] || [];
    db.notifications[job.employerId].unshift({
      id: `n-app-${app.id}`,
      title: 'Có ứng viên mới',
      message: `${currentUser.fullName} vừa ứng tuyển vào tin "${job.title}".`,
      createdAt: nowIso(),
      isRead: false,
      link: `/ung-tuyen-viec-lam/${job.id}`,
    });
    return ok({ success: true, id: app.id }, 201);
  }

  const applicantsMatch = path.match(/^\/api\/job\/([^/]+)\/applicants$/);
  if (method === 'get' && applicantsMatch) {
    return ok(db.applications.filter((app) => app.jobId === applicantsMatch[1]));
  }

  const singleJobMatch = path.match(/^\/api\/job\/([^/]+)$/);
  if (singleJobMatch) {
    const job = getJobById(singleJobMatch[1]);
    if (!job) return errorResponse(404, 'Không tìm thấy công việc.');
    if (method === 'get') return ok(job);
    if (method === 'delete') {
      db.jobs = db.jobs.filter((item) => item.id !== job.id);
      db.applications = db.applications.filter((app) => app.jobId !== job.id);
      delete db.matches[job.id];
      return ok({ success: true });
    }
  }

  const acceptMatch = path.match(/^\/api\/job\/applications\/([^/]+)\/accept$/);
  if (method === 'post' && acceptMatch) {
    const app = getApplicationById(acceptMatch[1]);
    if (!app) return errorResponse(404, 'Không tìm thấy hồ sơ ứng tuyển.');
    app.status = 1;
    app.isAccepted = true;
    db.applications.forEach((item) => {
      if (item.jobId === app.jobId && item.id !== app.id && item.status === 0) item.status = 2;
    });
    const job = getJobById(app.jobId);
    if (job) job.status = 1;
    db.notifications[app.applicantId] = db.notifications[app.applicantId] || [];
    db.notifications[app.applicantId].unshift({
      id: `n-accepted-${app.id}`,
      title: 'Hồ sơ được chấp nhận',
      message: `Bạn đã được chọn cho công việc "${app.jobTitle}".`,
      createdAt: nowIso(),
      isRead: false,
      link: '/dashboard/viec-da-ung-tuyen',
    });
    return ok({ success: true });
  }

  const rejectMatch = path.match(/^\/api\/job\/applications\/([^/]+)\/reject$/);
  if (method === 'post' && rejectMatch) {
    const app = getApplicationById(rejectMatch[1]);
    if (!app) return errorResponse(404, 'Không tìm thấy hồ sơ ứng tuyển.');
    app.status = 2;
    app.isAccepted = false;
    return ok({ success: true });
  }

  const cvMatch = path.match(/^\/api\/job\/applications\/([^/]+)\/cv$/);
  if (method === 'get' && cvMatch) {
    const app = getApplicationById(cvMatch[1]);
    if (!app || !app.cvUrl || app.cvUrl === '[Processing...]') {
      return errorResponse(404, 'CV chưa sẵn sàng.');
    }
    return ok({ url: app.cvUrl });
  }

  return null;
};

const handleMatchingRoutes = async (method, path) => {
  const matchRoute = path.match(/^\/api\/matching\/jobs\/([^/]+)\/workers$/);
  if (method === 'get' && matchRoute) {
    return ok(db.matches[matchRoute[1]] || []);
  }
  return null;
};

const handleUserRoutes = async (method, path, config, body, searchParams) => {
  const currentUser = getCurrentUser(config);

  if (method === 'get' && path === '/api/user/workers/public') {
    return ok(filterWorkers(searchParams));
  }

  const workerDetailMatch = path.match(/^\/api\/user\/workers\/public\/([^/]+)$/);
  if (method === 'get' && workerDetailMatch) {
    const worker = Object.values(db.users).find((user) => user.id === workerDetailMatch[1] && user.role === 'worker');
    if (!worker) return errorResponse(404, 'Không tìm thấy hồ sơ ứng viên.');
    return ok(getWorkerSummary(worker));
  }

  if (method === 'get' && path === '/api/user/profile') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
    return ok({
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      email: currentUser.email,
      avatarUrl: currentUser.avatarUrl,
      gender: currentUser.gender ?? 0,
      dateOfBirth: currentUser.dateOfBirth,
      phoneVerified: currentUser.phoneVerified,
      phoneVerifiedAt: currentUser.phoneVerifiedAt,
      phoneVerificationChannel: currentUser.phoneVerificationChannel,
      additionalInfo: currentUser.additionalInfo,
      workerProfile: currentUser.workerProfile,
    });
  }

  if (method === 'post' && path === '/api/user/profile') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
    currentUser.fullName = body.fullName || currentUser.fullName;
    currentUser.name = currentUser.fullName;
    currentUser.email = body.email || '';
    currentUser.avatarUrl = body.avatarUrl || currentUser.avatarUrl;
    currentUser.gender = body.gender ?? currentUser.gender;
    currentUser.dateOfBirth = body.dateOfBirth || null;
    currentUser.additionalInfo = body.additionalInfo || currentUser.additionalInfo;
    currentUser.updatedAt = nowIso();
    if (currentUser.role === 'worker') {
      currentUser.workerProfile = {
        bio: body.bio || '',
        desiredJobTitle: body.desiredJobTitle || '',
        seekingDescription: body.seekingDescription || '',
        experienceYears: Number(body.experienceYears || 0),
        hourlyRate: Number(body.hourlyRate || 0),
        desiredServiceCategories: JSON.stringify(body.desiredServiceCategories || []),
        preferredLocations: JSON.stringify(body.preferredLocations || []),
        skills: JSON.stringify(body.skills || []),
        isProfilePublic: Boolean(body.isProfilePublic),
      };
    }
    return ok({ success: true, message: 'Lưu hồ sơ demo thành công.' });
  }

  if (method === 'post' && path === '/api/user/uploadfile') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
    const imgurl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.fullName)}`;
    currentUser.avatarUrl = imgurl;
    return ok({ imgurl }, 201);
  }

  if (method === 'post' && path === '/api/user/phone-verification/send') {
    return ok({ message: 'OTP demo đã được gửi. Mã mặc định là 123456.' });
  }

  if (method === 'post' && path === '/api/user/phone-verification/verify') {
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
    if (String(body.otpCode || '') !== '123456') {
      return errorResponse(400, 'Mã OTP demo không đúng. Hãy dùng 123456.');
    }
    currentUser.phoneVerified = true;
    currentUser.phoneVerifiedAt = nowIso();
    currentUser.phoneVerificationChannel = 'ZaloOA';
    return ok({ message: 'Xác minh số điện thoại thành công.', channel: 'ZaloOA' });
  }

  return null;
};

const handleWorkerRoutes = async (method, path, config) => {
  if (method === 'get' && path === '/api/worker/jobschedule') {
    const currentUser = getCurrentUser(config);
    if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
    return ok(getWorkerSchedule(currentUser.id));
  }
  return null;
};

const handleNotificationRoutes = async (method, path, config, searchParams) => {
  const currentUser = getCurrentUser(config);
  if (!currentUser) return errorResponse(401, 'Bạn cần đăng nhập.');
  if (method === 'get' && path === '/api/notification') {
    const limit = Number(searchParams.get('limit') || 12);
    const items = (db.notifications[currentUser.id] || []).slice(0, limit);
    return ok({ items, unreadCount: items.filter((item) => !item.isRead).length });
  }
  if (method === 'post' && path === '/api/notification/read-all') {
    (db.notifications[currentUser.id] || []).forEach((item) => {
      item.isRead = true;
    });
    return ok({ success: true });
  }
  const readOneMatch = path.match(/^\/api\/notification\/([^/]+)\/read$/);
  if (method === 'post' && readOneMatch) {
    const item = (db.notifications[currentUser.id] || []).find((entry) => entry.id === readOneMatch[1]);
    if (item) item.isRead = true;
    return ok({ success: true });
  }
  return null;
};

const handleMockRequest = async ({ method, url, data, config }) => {
  const provinceResponse = handleProvinceRequest(url);
  if (provinceResponse) return provinceResponse;

  const parsedUrl = getUrl(url, config?.params);
  const path = parsedUrl.pathname.toLowerCase();
  const body = parseBody(data);
  const handlers = [
    () => handleAuthRoutes(method, path, body),
    () => handleJobRoutes(method, path, config, body),
    () => handleMatchingRoutes(method, path),
    () => handleUserRoutes(method, path, config, body, parsedUrl.searchParams),
    () => handleWorkerRoutes(method, path, config),
    () => handleNotificationRoutes(method, path, config, parsedUrl.searchParams),
  ];

  for (const handler of handlers) {
    const response = await handler();
    if (response) return response;
  }

  return errorResponse(404, `Chưa mock endpoint: ${method.toUpperCase()} ${parsedUrl.pathname}`);
};

export const setupMockApi = () => {
  if (!DEMO_MODE || axios.__demoPatched) return;
  axios.__demoPatched = true;
  resetDb();

  const originalGet = axios.get.bind(axios);
  const originalPost = axios.post.bind(axios);
  const originalDelete = axios.delete.bind(axios);

  axios.get = (url, config = {}) => (shouldMock(url) ? handleMockRequest({ method: 'get', url, config }) : originalGet(url, config));
  axios.post = (url, data = {}, config = {}) =>
    shouldMock(url) ? handleMockRequest({ method: 'post', url, data, config }) : originalPost(url, data, config);
  axios.delete = (url, config = {}) => (shouldMock(url) ? handleMockRequest({ method: 'delete', url, config }) : originalDelete(url, config));
};
