<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

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
    public function getCoursesByCategory($categoryId)
    {
        $courses = Course::where('category_id', $categoryId)->get();
        return response()->json(CourseResource::collection($courses));
    }
}
