import { toast } from 'react-toastify';

export const showToast = (message, type = 'success') => {
  const isDarkMode = document.documentElement.classList.contains('dark-theme');
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: isDarkMode ? 'dark' : 'light',
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'warning':
      return toast.warning(message, toastOptions);
    case 'info':
      return toast.info(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
};
