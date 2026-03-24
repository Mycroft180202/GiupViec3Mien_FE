export const roleMap = {
  0: 'admin',
  1: 'employer',
  2: 'worker',
  Admin: 'admin',
  Employer: 'employer',
  Worker: 'worker',
};

export const normalizeStoredUser = (user) => {
  if (!user) return null;

  const normalizedRole = roleMap[user.role] || user.role || 'employer';
  const fullName = user.fullName || user.name || '';

  return {
    id: user.id || user.userId || null,
    fullName,
    name: fullName,
    phone: user.phone || '',
    email: user.email || '',
    avatarUrl: user.avatarUrl || '',
    role: normalizedRole,
    isGuest: Boolean(user.isGuest),
    hasPremiumAccess: Boolean(user.hasPremiumAccess),
    premiumExpiry: user.premiumExpiry || null,
    phoneVerified: Boolean(user.phoneVerified),
    phoneVerifiedAt: user.phoneVerifiedAt || null,
    phoneVerificationChannel: user.phoneVerificationChannel || null,
  };
};

export const buildUserFromAuthResponse = (data) => normalizeStoredUser({
  id: data.userId,
  fullName: data.fullName,
  phone: data.phone,
  email: data.email,
  role: data.role,
  isGuest: data.isGuest,
  hasPremiumAccess: data.hasPremiumAccess,
  premiumExpiry: data.premiumExpiry,
  avatarUrl: data.avatarUrl,
  phoneVerified: data.phoneVerified,
  phoneVerifiedAt: data.phoneVerifiedAt,
  phoneVerificationChannel: data.phoneVerificationChannel,
});
