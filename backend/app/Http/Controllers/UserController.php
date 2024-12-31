<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
    // ----------------- POST: Register new user ----------------
    public function store(StoreUserRequest $request) {

        try {
            DB::beginTransaction();
            // Create User object
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'gender' => $request->gender
            ]);

            // Generate token
            $token = $user->createToken('authToken')->plainTextToken;
            DB::commit();

            // Return response
            return response()->json([
                'status' => 'success',
                'message' => 'Successful Registration',
                'token' => $token,
                'user' => new UserResource($user),
            ], 201);

        } catch(Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong, please try again later',
            ], 500);
        }
    }
}
