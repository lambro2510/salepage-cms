import { AxiosError } from 'axios';
import { toast } from 'sonner';
import dayjs, { Dayjs } from 'dayjs';
export const API_URL = `https://salepage-server-rherm.appengine.bfcplatform.vn/api/v1`;
// export const API_URL = `http://localhost:8080/api/v1`;

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

export const roundedNumber = (number : number, fixed = 2) => {
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

export const convertDate = (date :any, format = 'dd-mm-yyyy') => {
  return dayjs(date, format);
}
