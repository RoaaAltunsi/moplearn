import { clearErrors as clearAuthErrors } from "./slices/authSlice";
import { clearErrors as clearContributionFormErrors } from "./slices/contributionFormSlice";
import { clearErrors as clearContributorErrors } from "./slices/contributorSlice";
import { clearErrors as clearCourseErrors } from "./slices/courseSlice";
import { clearErrors as clearCategoryErrors } from "./slices/categorySlice";
import { clearErrors as clearLanguageErrors } from "./slices/languageSlice";
import { clearErrors as clearTopicErrors } from "./slices/topicSlice";
import { clearErrors as clearUserErrors } from "./slices/userSlice";
import { clearErrors as clearProfileErrors } from "./slices/userProfileSlice";
import { clearErrors as clearFriendshipErrors } from "./slices/friendshipSlice";


export const clearAllErrors = () => (dispatch) => {
    dispatch(clearAuthErrors());
    dispatch(clearContributionFormErrors());
    dispatch(clearContributorErrors());
    dispatch(clearCourseErrors());
    dispatch(clearCategoryErrors());
    dispatch(clearLanguageErrors());
    dispatch(clearTopicErrors());
    dispatch(clearUserErrors());
    dispatch(clearProfileErrors());
    dispatch(clearFriendshipErrors());
}