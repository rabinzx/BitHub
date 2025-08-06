import dayjs from "dayjs";
import { RootState } from "./store";

export const selectIsTokenExpired = (state: RootState): boolean => {
  const expiresIn = state.auth.userInfo?.expires_in;
  if (!expiresIn) return true;
  return dayjs().isAfter(dayjs(expiresIn));
};
