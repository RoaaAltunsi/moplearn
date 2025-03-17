<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserProfileRequest;
use App\Http\Requests\UpdateUserAccountRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display all users (with filtering)
     */
    public function getUsers(Request $request)
    {
        $itemsPerPaage = 9;
        $query = User::query();

        // Exclude the authenticated user
        $authUserId = $request->user()->id;
        $query->where('id', '!=', $authUserId);

        // Course Filter
        if ($request->has('course')) {
            $courseId = $request->input('course');
            $query->whereHas('courses', function ($q) use ($courseId) {
                $q->where('courses.id', $courseId);
            });
        }

        // Language Filter
        if ($request->has('language')) {
            $languageId = $request->input('language');
            $query->whereHas('languages', function ($q) use ($languageId) {
                $q->where('languages.id', $languageId);
            });
        }

        // Topic Filter
        if ($request->has('topic')) {
            $topicId = $request->input('topic');
            $query->whereHas('interests', function ($q) use ($topicId) {
                $q->where('topics.id', $topicId);
            });
        }

        // Pagination
        $currentPage = $request->input('page', 1);
        $users = $query->paginate($itemsPerPaage, ['*'], 'page', $currentPage);

        return response()->json([
            'users' => UserResource::collection($users->items()), // The actual paginated data
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function storeOrUpdateProfile(StoreUserProfileRequest $request)
    {
        $user = $request->user();

        // Update or create profile
        $profile = $user->profile()->firstOrCreate([]);
        $profile->update($request->validated());

        // Update profile image
        $profileImgPath = null;
        if ($request->hasFile('image')) {
            // delete old image
            if ($profile->image) {
                Storage::disk('public')->delete($profile->image);
            }
            
            // store new image
            $profileImgPath = $request->file('image')->store('uploads', 'public'); // Save in storage/app/public/uploads
            
            // Update image field in user profile
            $profile->update(['image' => $profileImgPath]);
        }

        // Handle updating languages
        if ($request->filled('languages')) {
            $languageIds = explode(',', $request->input('languages'));
            $user->languages()->sync(array_filter($languageIds)); // Sync (remove old & add new)
        }

        // Handle updating interests
        if ($request->filled('interests')) {
            $interestIds = explode(',', $request->input('interests'));
            $user->interests()->sync(array_filter($interestIds)); // Sync (remove old & add new)
        }

        // Reload user with updated profile, languages, and interests
        $user->load(['profile', 'languages', 'interests']);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully!',
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update user account
     */
    public function updateAccount(UpdateUserAccountRequest $request)
    {
        $user = $request->user();

        $dataToUpdate = array_filter($request->only(['username', 'email']),
        fn($value) => !is_null($value)
        );

        $user->update($dataToUpdate);

        return response()->json([
            'status' => 'success',
            'message' => 'Account updated successfully!',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Validate password confirmation
        $request->validate([
            'password' => 'required|string'
        ]);
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Incorrect password'
            ], 403);
        }

        // Delete associated images if exist
        if ($user->profile && $user->profile->image) {
            Storage::disk('public')->delete($user->profile->image);
        }

        // Delete user relationships
        $user->courses()->detach();
        $user->languages()->detach();
        $user->interests()->detach();
        $user->profile()->delete();

        // Logout user before deletion
        Auth::logout();

        // Delete user account
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Your account has been deleted successfully'
        ]);
    }

}
