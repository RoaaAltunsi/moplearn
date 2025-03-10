import { clearErrors as clearAuthErrors } from "./slices/authSlice";
import { clearErrors as clearContributionFormErrors } from "./slices/contributionFormSlice";
import { clearErrors as clearContributorErrors } from "./slices/contributorSlice";
import { clearErrors as clearCourseErrors } from "./slices/courseSlice";
import { clearErrors as clearCategoryErrors } from "./slices/categorySlice";
import { clearErrors as clearLanguageErrors } from "./slices/languageSlice";
import { clearErrors as clearTopicErrors } from "./slices/topicSlice";

export const clearAllErrors = () => (dispatch) => {
    dispatch(clearAuthErrors());
    dispatch(clearContributionFormErrors());
    dispatch(clearContributorErrors());
    dispatch(clearCourseErrors());
    dispatch(clearCategoryErrors());
    dispatch(clearLanguageErrors());
    dispatch(clearTopicErrors());
}