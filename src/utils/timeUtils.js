export const getPromoTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;
  if (diffMs <= 0) {
    return { expired: true, text: 'انتهى العرض' };
  }
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const remainingSeconds = diffSeconds % 60;
    return {
      expired: false,
      text: `⏰ باقي ${diffMinutes} دقيقة و ${remainingSeconds} ثانية`,
      urgent: true
    };
  }
  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    const remainingSeconds = diffSeconds % 60;
    return {
      expired: false,
      text: `⏰ باقي ${diffHours} ساعة و ${remainingMinutes} دقيقة و ${remainingSeconds} ثانية`,
      urgent: true
    };
  }
  return {
    expired: false,
    text: `⏰ ينتهي: ${end.toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`,
    urgent: false
  };
};
export const getPromoTimeRemainingDetailed = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;

  if (diffMs <= 0) {
    return { expired: true, text: 'انتهى العرض' };
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));


  if (diffHours < 1) {
    const remainingSeconds = diffSeconds % 60;
    return {
      expired: false,
      text: `⏰ العرض ينتهي خلال ${diffMinutes} دقيقة و ${remainingSeconds} ثانية فقط!`,
      urgent: true
    };
  }

  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    const remainingSeconds = diffSeconds % 60;
    return {
      expired: false,
      text: `⏰ العرض ينتهي خلال ${diffHours} ساعة و ${remainingMinutes} دقيقة و ${remainingSeconds} ثانية`,
      urgent: true
    };
  }

  return {
    expired: false,
    text: `⏰ العرض ينتهي: ${end.toLocaleString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`,
    urgent: false
  };
};
