<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthController extends Controller
{
    /**
     * Register a new user
    */
    public function register(StoreUserRequest $request) 
    {
        try {
            DB::beginTransaction();
            // Create User object
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            DB::commit();

            // Log the user in after registration
            Auth::login($user);

            // Return response
            return response()->json([
                'status' => 'success',
                'message' => 'Successful Registration',
                'user' => new UserResource($user),
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong. Please try again later'
            ], 500);
        }
    }

    /**
     * Authenticate login attempt
    */
    public function login(Request $request)
    {
        // Validate request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Unautharized login attempt
        if (!Auth::attempt($credentials, true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Get authenticated user
        $user = Auth::user();

        return response()->json([
            'status' => 'success',
            'message' => 'Successful Login',
            'user' => new UserResource($user),
        ], 200);
    }

    /**
     * Logout user
    */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken(); // Regenerate CSRF token: ensures that any old tokens are invalidated

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ], 200);
    }

    /**
     * Validate user's email
    */
    public function validateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Email is valid'
        ], 200);
    }

    /**
     * Reset user's Password
    */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8'
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Update Password
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Password has been successfully reset'
        ], 200);

    }
    
}
