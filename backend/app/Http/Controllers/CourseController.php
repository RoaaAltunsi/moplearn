<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    /**
     * Display the latest new courses
     */
    public function getNewCourses()
    {
        $newCourses = Course::orderBy('created_at', 'desc')
            ->take(6)
            ->get();
        
        return response()->json(CourseResource::collection($newCourses));
    }

    /**
     * Display the cheapest courses
     */
    public function getCheapestCourses()
    {
        $cheapestCourses = Course::orderBy('price', 'asc')
            ->take(6)
            ->get();
        
        return response()->json(CourseResource::collection($cheapestCourses));
    }

    /**
     * Display all courses under specific category
     */
    public function getCoursesByCategory(Request $request, $categoryId)
    {
        $itemsPerPaage = 9;
        $query = Course::query();
        $query->where('category_id', $categoryId);

        // Price Filter
        if ($request->has('price')) {
            $prices = explode(',', $request->input('price'));
            $priceConditions = [];
            
            foreach ($prices as $filter) {
                if ($filter == 'free') {
                    $priceConditions[] = ['price', '=', 0];
                }
                if ($filter == 'discounted') {
                    $priceConditions[] = ['old_price', '>', 'price'];
                }
            }
            if (!empty($priceConditions)) {
                $query->where(function ($q) use ($priceConditions) {
                   foreach ($priceConditions as $condition) {
                      $q->orWhere([$condition]); // Combine conditions with OR
                   }
                });
            }
        }

        // Topic Filter
        if ($request->has('topics')) {
            $topics = explode(',', $request->input('topics'));
            $query->whereIn('topic_id', $topics);
        }

        // Level Filter
        if ($request->has('levels')) {
            $levels = explode(',', $request->input('levels'));
            $query->whereIn('level', $levels);
        }

        // Platfrom Filter
        if($request->has('platforms')) {
            $platforms = explode(',', $request->input('platforms'));
            $query->whereIn('platform_id', $platforms);
        }

        // Language Filter
        if ($request->has('languages')) {
            $languages = explode(',', $request->input('languages'));
            $query->whereIn('language_id', $languages);
        }

        // Sort Filter
        if ($request->has('sort')) {
            switch($request->input('sort')) {
                case 'highest-rated':
                    $query->orderBy('rating', 'desc');
                    break;
                case 'cheapest':
                    $query->orderBy('price', 'asc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        }

        // Pagination
        $currentPage = $request->input('page', 1);
        $courses = $query->paginate($itemsPerPaage, ['*'], 'page', $currentPage);

        return response()->json([
            'courses' => CourseResource::collection($courses->items()), // The actual paginated data
            'pagination' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
            ]
        ]);
    }

    /**
     * Add the user to course's partner list
     */
    public function addToPartnerList(Request $request, $courseId)
    {
        $user = $request->user();
        $user->courses()->syncWithoutDetaching([$courseId]);
        return response()->json([
            'status' => 'success',
            'message' => 'Added to partner list'
        ], 201);
    }

    /**
     * Remove the user from course's partner list
     */
    public function removeFromPartnerList(Request $request, $courseId)
    {
        $user = $request->user();
        $user->courses()->detach($courseId);
        return response()->json([
            'status' => 'success',
            'message' => 'Removed from partner list'
        ]);
    }
}
