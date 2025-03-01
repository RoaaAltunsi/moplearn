<?php

namespace App\Http\Controllers;

use App\Models\Contributor;

class ContributorController extends Controller
{
    /**
     * Get all contributors with related contribution form
     */
    public function index()
    {
        $contributors = Contributor::with(['contributionForm' => function($query) {
            $query->select('id', 'platform_name', 'logo', 'email', 'phone_number');
        }])->get();

        return response()->json($contributors);
    }

    /**
     * Get a single contributor with related contribution form
     */
    public function show(string $id)
    {
        $contributor = Contributor::with(['contributionForm' => function ($query) {
            $query->select('id', 'platform_name', 'logo', 'phone_number', 'email');
        }])->findOrFail($id);

        return response()->json($contributor);
    }
}
