import { toast } from "react-toastify";

export const SuccessToast = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2500,
    style: { color: "white", top: 108, fontSize: "14px" },
  });
};

export const ErrorToast = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2500,
    style: { color: "white", top: 108, fontSize: "14px" },
  });
};
