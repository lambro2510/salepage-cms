import { AxiosError } from 'axios';
import { toast } from 'sonner';
import dayjs, { Dayjs } from 'dayjs';
// export const API_URL = `https://salepage-server-rherm.appengine.bfcplatform.vn/api/v1`;
// export const API_URL = `http://localhost:8080/api/v1`;
export const API_URL = `https://sale-api.luckypresent.com.vn/api/v1`;
export enum NotificationType {
  ERROR = 'error',
  SUCCESS = 'success',
}

export const setPageTitle = (title: string) => {
  window.document.title = title;
};

export const showNotification = (
  message = 'Đã có lỗi xảy ra',
  type: NotificationType = NotificationType.ERROR,
  description?: string
) => {
  toast[type](message, {
    description: description,
  });
};

export const roundedNumber = (number: number, fixed = 2) => {
  return parseFloat(number.toFixed(fixed));
}
export const handleErrorResponse = (
  error: any,
  callback?: () => void,
  errorMessage?: string
) => {
  console.error(error);

  if (!errorMessage) {
    errorMessage = 'Đã có lỗi xảy ra';

    if (typeof error === 'string') {
      try {
        error = JSON.parse(error);
      } catch (error) {

      }
    }

    if (error instanceof AxiosError && error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
  }

  showNotification(
    errorMessage &&
    errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    NotificationType.ERROR
  );

  if (callback) {
    return callback();
  }
}

export const convertDate = (date: any, format = 'dd-mm-yyyy') => {
  return dayjs(date, format);
}

export function hsvToHex(h: number, s: number, v: number) {
  // Ensure h is in the range [0, 360), s and v are in [0, 1]
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));

  const hi = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;
  if (hi === 0) {
    r = v;
    g = t;
    b = p;
  } else if (hi === 1) {
    r = q;
    g = v;
    b = p;
  } else if (hi === 2) {
    r = p;
    g = v;
    b = t;
  } else if (hi === 3) {
    r = p;
    g = q;
    b = v;
  } else if (hi === 4) {
    r = t;
    g = p;
    b = v;
  } else {
    r = v;
    g = p;
    b = q;
  }

  // Convert to 8-bit integers
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert to hex
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export const convertUTCToVietnamTime = (utcTimestamp: number) => {
  // const utcDate = new Date(utcTimestamp);

  const vietnamDate = new Date(utcTimestamp);

  const year = vietnamDate.getFullYear();
  const month = ('0' + (vietnamDate.getMonth() + 1)).slice(-2);
  const day = ('0' + vietnamDate.getDate()).slice(-2);
  const hours = ('0' + vietnamDate.getHours()).slice(-2);
  const minutes = ('0' + vietnamDate.getMinutes()).slice(-2);
  const seconds = ('0' + vietnamDate.getSeconds()).slice(-2);

  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}