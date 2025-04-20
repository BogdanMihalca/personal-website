import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
    window.location.hash = `#${id}`;
  }
};


const FALLBACK_IP_ADDRESS = '0.0.0.0';

export const getRealIp = async (headers: Headers, cfProxy = false) => {

  if (cfProxy && headers.has('cf-connecting-ip')) {
    return headers.get('cf-connecting-ip');
  }

  if (headers.has('x-real-ip')) {
    return headers.get('x-real-ip');
  }

  if (headers.has('x-forwarded-for')) {
    return headers.get('x-forwarded-for');
  }

  if (headers.has('x-vercel-forwarded-for')) {
    return headers.get('x-vercel-forwarded-for');
  }

  if (headers.has('x-vercel-proxied-for')) {
    return headers.get('x-vercel-proxied-for');
  }

  if (headers.has('x-client-ip')) {
    return headers.get('x-client-ip');
  }
  if (headers.has('x-cluster-client-ip')) {
    return headers.get('x-cluster-client-ip');
  }
  return FALLBACK_IP_ADDRESS;
}

export async function isAuthorized(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return false;
  }

  const [type, key] = authHeader.split(' ');

  if (type !== 'Bearer' || !key) {
    return false;
  }

  return key === process.env.AUTOMATION_API_KEY;
}

export const getRealUserAgent = (headers: Headers) => {
  if (headers.has('user-agent')) {
    return headers.get('user-agent') || 'unknown';
  }

  if (headers.has('x-vercel-user-agent')) {
    return headers.get('x-vercel-user-agent') || 'unknown';
  }
  if (headers.has('x-client-user-agent')) {
    return headers.get('x-client-user-agent') || 'unknown';
  }
  return 'unknown';
}


// helper function to format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: Date, now: Date): string {
  const secondsAgo = Math.round((now.getTime() - date.getTime()) / 1000);

  // less than a minute
  if (secondsAgo < 60) {
    return "just now";
  }

  // less than an hour
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // less than a day
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // less than a month (30 days)
  if (secondsAgo < 2592000) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // less than a year
  if (secondsAgo < 31536000) {
    const months = Math.floor(secondsAgo / 2592000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  // more than a year
  const years = Math.floor(secondsAgo / 31536000);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}