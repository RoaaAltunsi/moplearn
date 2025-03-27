<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContributionFormController;
use App\Http\Controllers\ContributorController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserProfileController;

// Route::get('csrf-token', function() {
//     return response()->json(['csrf_token' => csrf_token()]);
// });

// Check for an authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
    ]);
});

Route::get('categories', [CategoryController::class, 'index']);
Route::get('languages', [LanguageController::class, 'index']);
Route::get('topics/categories/{categoryId}', [TopicController::class, 'getTopicsByCategory']);
Route::get('topics', [TopicController::class, 'index']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('email/validation', [AuthController::class, 'validateEmail']);
Route::post('password/reset', [AuthController::class, 'resetPassword']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::put('account', [UserController::class, 'updateAccount']);
    Route::delete('account', [UserController::class, 'deleteAccount']);
    Route::post('profile', [UserProfileController::class, 'storeOrUpdateProfile']);

    Route::prefix('users')->group(function() {
        Route::get('/', [UserController::class, 'getUsers']);
        Route::get('{id}/courses', [UserController::class, 'getUserCourses']);
        Route::get('username/{username}', [UserController::class, 'getUserByUsername']);
        Route::get('{id}/friends',[FriendshipController::class, 'getFriends']);
        Route::get('{id}/friends-summary',[FriendshipController::class, 'getFriendsSummaries']);
    });

    Route::prefix('friends')->group(function() {
        Route::post('/', [FriendshipController::class, 'store']);
        Route::delete('{id}', [FriendshipController::class, 'destroy']);
        Route::get('requests/received', [FriendshipController::class, 'getReceivedRequests']);
        Route::get('requests-summary/received', [FriendshipController::class, 'getReceivedRequestsSummaries']);
        Route::get('requests/sent', [FriendshipController::class, 'getSentRequests']);
        Route::get('requests-summary/sent', [FriendshipController::class, 'getSentRequestsSummaries']);
        Route::patch('{id}/status', [FriendshipController::class, 'updateStatus']);
    });
});

Route::prefix('courses')->group(function () {
    Route::get('new', [CourseController::class, 'getNewCourses']);
    Route::get('cheapest', [CourseController::class, 'getCheapestCourses']);
    Route::get('categories/{categoryId}', [CourseController::class, 'getCoursesByCategory']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('{courseId}/partner-list', [CourseController::class, 'addToPartnerList']);
        Route::delete('{courseId}/partner-list', [CourseController::class, 'removeFromPartnerList']);
    });
});

Route::apiResource('contribution-forms', ContributionFormController::class)->only(['store', 'update']);
Route::apiResource('contributors',ContributorController::class)->only(['index', 'show']);
