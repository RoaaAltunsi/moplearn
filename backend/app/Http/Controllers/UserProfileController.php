<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserProfileRequest;
use App\Http\Resources\UserFullResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    /**
     * Store/Update user profile
     */
    public function storeOrUpdateProfile(StoreUserProfileRequest $request)
    {
        $user = $request->user();

        // Update or create profile
        $profile = $user->profile()->firstOrCreate([]);

        // -------------- Update profile image --------------
        // removing profile image
        if ($request->boolean('remove_image')) {
            if ($profile->image) {
                Storage::disk('public')->delete($profile->image);
                $profile->update(['image' => null]);
            }
        }
        // replace profile image with another one
        $profileImgPath = null;
        if ($request->hasFile('image')) {
            // delete old image
            if ($profile->image) {
                Storage::disk('public')->delete($profile->image);
                $profile->update(['image' => null]);
            }
            
            // store new image
            $profileImgPath = $request->file('image')->store('uploads', 'public'); // Save in storage/app/public/uploads
            
            // Update image field in user profile
            $profile->update(['image' => $profileImgPath]);
        }

        // ----------- Update profile background image -----------
        // removing background image
        if ($request->boolean('remove_background')) {
            if ($profile->profile_background) {
                Storage::disk('public')->delete($profile->profile_background);
                $profile->update(['profile_background' => null]);
            }
        }
        // replace profile background image with another one
        $profileBgImgPath = null;
        if ($request->hasFile('profile_background')) {
            // delete old background
            if ($profile->profile_background) {
                Storage::disk('public')->delete($profile->profile_background);
            }

            // store new background
            $profileBgImgPath = $request->file('profile_background')->store('uploads', 'public');

            // Update profile background field in user profile
            $profile->update(['profile_background' => $profileBgImgPath]);
        }

        // -------------- Update other fields --------------
        $data = $request->safe()->except(['image', 'profile_background']);
        $profile->fill($data);
        $profile->save();

        // -------------- Update languages --------------
        if ($request->filled('languages')) {
            $languageIds = explode(',', $request->input('languages'));
            $user->languages()->sync(array_filter($languageIds)); // Sync (remove old & add new)
        }

        // -------------- Update interests --------------
        if ($request->filled('interests')) {
            $interestIds = explode(',', $request->input('interests'));
            $user->interests()->sync(array_filter($interestIds)); // Sync (remove old & add new)
        }

        // Reload user with updated profile, languages, and interests
        $user->load(['profile', 'languages', 'interests']);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully!',
            'user' => new UserFullResource($user)
        ]);
    }
}
