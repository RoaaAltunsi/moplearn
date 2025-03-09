<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContributionFormController;
use App\Http\Controllers\ContributorController;
use App\Http\Controllers\CourseController;

Route::get('csrf-token', function() {
    return response()->json(['csrf_token' => csrf_token()]);
});
Route::get('new-courses', [CourseController::class, 'getNewCourses']);
Route::get('cheapest-courses', [CourseController::class, 'getCheapestCourses']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('validate-email', [AuthController::class, 'validateEmail']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::apiResource('contribution-forms', ContributionFormController::class)->only(['store', 'update']);
Route::apiResource('contributors',ContributorController::class)->only(['index', 'show']);
