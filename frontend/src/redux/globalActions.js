import { clearErrors as clearAuthErrors } from "./slices/authSlice";
import { clearErrors as clearContributionFormErrors } from "./slices/contributionFormSlice";
import { clearErrors as clearContributorErrors } from "./slices/contributorSlice";
import { clearErrors as clearCourseErrors } from "./slices/courseSlice";

export const clearAllErrors = () => (dispatch) => {
    dispatch(clearAuthErrors());
    dispatch(clearContributionFormErrors());
    dispatch(clearContributorErrors());
    dispatch(clearCourseErrors());
}