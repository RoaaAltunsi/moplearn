import { clearErrors as clearAuthErrors } from "./slices/authSlice" 

export const clearAllErrors = () => (dispatch) => {
    dispatch(clearAuthErrors());
}