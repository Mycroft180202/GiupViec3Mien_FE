export const getApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.title && responseData?.errors) {
    const firstErrorGroup = Object.values(responseData.errors)[0];
    if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
      return firstErrorGroup[0];
    }
    return responseData.title;
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  return fallbackMessage || error?.message || 'Có lỗi xảy ra.';
};
