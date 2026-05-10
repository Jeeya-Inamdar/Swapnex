import { useCallback } from "react";
import toast from "react-hot-toast";

const useShowToast = () => {
  const showToast = useCallback((title, description, status) => {
    // Mapping Chakra status to react-hot-toast methods
    const message = description || title;
    
    switch (status) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  }, []);

  return showToast;
};

export default useShowToast;
