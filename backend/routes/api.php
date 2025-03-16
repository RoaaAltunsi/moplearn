<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContributionFormController;
use App\Http\Controllers\ContributorController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\TopicController;


Route::get('csrf-token', function() {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('categories', [CategoryController::class, 'index']);
Route::get('new-courses', [CourseController::class, 'getNewCourses']);
Route::get('cheapest-courses', [CourseController::class, 'getCheapestCourses']);
Route::get('categories/{categoryId}/courses', [CourseController::class, 'getCoursesByCategory']);
Route::get('languages', [LanguageController::class, 'index']);
Route::get('categories/{categoryId}/topics', [TopicController::class, 'getTopicsByCategory']);
Route::get('topics', [TopicController::class, 'index']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('validate-email', [AuthController::class, 'validateEmail']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('users', [UserController::class, 'getUsers']);
    Route::post('update-profile', [UserController::class, 'updateProfile']);
});

Route::apiResource('contribution-forms', ContributionFormController::class)->only(['store', 'update']);
Route::apiResource('contributors',ContributorController::class)->only(['index', 'show']);
