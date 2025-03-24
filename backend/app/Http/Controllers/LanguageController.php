<?php

namespace App\Http\Controllers;

use App\Http\Resources\LanguageResource;
use App\Models\Language;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(LanguageResource::collection(
            Language::select('id', 'language')->get()
        ));
    }
}
