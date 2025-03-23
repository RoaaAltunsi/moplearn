<?php

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

Route::get('csrf-token', function() {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('categories', [CategoryController::class, 'index']);
Route::get('languages', [LanguageController::class, 'index']);
Route::get('topics/categories/{categoryId}', [TopicController::class, 'getTopicsByCategory']);
Route::get('topics', [TopicController::class, 'index']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('email/validation', [AuthController::class, 'validateEmail']);
Route::post('password/reset', [AuthController::class, 'resetPassword']);

Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('users', [UserController::class, 'getUsers']);
    Route::get('users/username/{username}', [UserController::class, 'getUserByUsername']);
    Route::put('account', [UserController::class, 'updateAccount']);
    Route::delete('account', [UserController::class, 'deleteAccount']);
    Route::post('profile', [UserProfileController::class, 'storeOrUpdateProfile']);
    Route::get('friends', [FriendshipController::class, 'getFriends']);
    Route::get('friends/requests/received', [FriendshipController::class, 'getReceivedRequests']);
    Route::get('friends/requests/sent', [FriendshipController::class, 'getSentRequests']);
    Route::patch('friends/{id}/status', [FriendshipController::class, 'updateStatus']);
    Route::delete('friends/{id}', [FriendshipController::class, 'destroy']);
});

Route::prefix('courses')->group(function () {
    Route::get('new', [CourseController::class, 'getNewCourses']);
    Route::get('cheapest', [CourseController::class, 'getCheapestCourses']);
    Route::get('categories/{categoryId}', [CourseController::class, 'getCoursesByCategory']);
});


Route::apiResource('contribution-forms', controller: ContributionFormController::class)->only(['store', 'update']);
Route::apiResource('contributors',ContributorController::class)->only(['index', 'show']);
