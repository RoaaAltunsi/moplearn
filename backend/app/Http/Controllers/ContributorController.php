<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContributorResource;
use App\Models\Contributor;

class ContributorController extends Controller
{
    /**
     * Get all contributors with related contribution form
     */
    public function index()
    {
        return ContributorResource::collection(
            Contributor::with('contributionForm')->get()
        );
    }

    /**
     * Get a single contributor with related contribution form
     */
    public function show(string $id)
    {
        return new ContributorResource(
            Contributor::with('contributionForm')->findOrFail($id)
        );
    }
}
