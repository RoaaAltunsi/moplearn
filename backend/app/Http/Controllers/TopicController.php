<?php

namespace App\Http\Controllers;

use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    /**
     * Display all topics
     */
    public function index()
    {
        $topics = Topic::all();
        return response()->json(TopicResource::collection($topics));
    }

    /**
     * Display all topics under specific category
     */
    public function getTopicsByCategory($categoryId)
    {
        $topics = Topic::where('category_id', $categoryId)->get();
        return response()->json(TopicResource::collection($topics));
    }

}
