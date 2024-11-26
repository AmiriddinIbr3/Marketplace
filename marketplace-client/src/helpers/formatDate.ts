export const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatTimeAgo = (inputDate: Date | string): string => {
    const date = new Date(inputDate);
    
    if (isNaN(date.getTime())) {
        throw new Error('Некорректная дата');
    }

    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) {
        return 'recently';
    }
    else if (minutes === 1) {
        return 'minute ago';
    }
    else if (minutes < 60) {
        return `${minutes} minutes ago`;
    }
    else if (hours === 1) {
        return 'hour ago';
    }
    else if (hours < 24) {
        return `${hours} hours ago`;
    }
    else if (days === 1) {
        return 'day ago';
    }
    else if (days < 7) {
        return `${days} days ago`;
    }
    else if (weeks === 1) {
        return 'week ago';
    }
    else if (weeks < 12) {
        return `${weeks} weeks ago`;
    }
    else if (months === 1) {
        return 'month ago';
    }
    else if (months < 12) {
        return `${months} months ago`;
    }
    else {
        return formatDate(date);
    }
};