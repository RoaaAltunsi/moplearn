<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['profile', 'languages', 'interests'])->get();
        return response()->json(UserResource::collection($users));
    }

    /**
     * Display all users
     */
    public function getUsers(Request $request)
    {
        $itemsPerPaage = 9;
        $query = User::query();

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
    
}
