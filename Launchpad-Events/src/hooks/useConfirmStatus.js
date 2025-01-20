import { useState } from "react";

export const useConfirmStatus = (initialState = {}) => {
  const [status, setStatus] = useState({
    remove: false,
    delete: false,
    cancel: false,
    ...initialState,
  });

  const openStatus = (statusType) =>
    setStatus((prev) => ({ ...prev, [statusType]: true }));
  const closeStatus = (statusType) =>
    setStatus((prev) => ({ ...prev, [statusType]: false }));

  return { status, openStatus, closeStatus };
};
