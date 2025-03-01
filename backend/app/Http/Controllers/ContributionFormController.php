<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContributionFormRequest;
use App\Http\Resources\ContributionFormResource;
use App\Models\ContributionForm;
use App\Models\Contributor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

use function Laravel\Prompts\error;

class ContributionFormController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContributionFormRequest $request)
    {
        try {
            DB::beginTransaction();

            // Validate and store image
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('platforms', 'public'); // Save in storage/app/public/platforms
            }

            // Create contribution form object
            $form = ContributionForm::create([
                'platform_name' => $request->platform_name,
                'logo' => $logoPath,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'content' => $request->content,
                'status' => 'pending'
            ]);
            DB::commit();

            // Return response
            return response()->json([
                'status' => 'success',
                'message' => 'Contribution form created successfully',
                'form' => new ContributionFormResource($form),
            ], 201);

        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong. Please try again later',
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Update contribution form status >> by the admin
        $request->validate([
            'status' => 'required|in:pending,accepted,rejected'
        ]);

        $form = ContributionForm::findOrFail($id);
        $form->status = $request->status;
        $form->save();

        // If form is approved >> create a contributor
        if ($request->status === 'accepted') {
            Contributor::create([
                'form_id' => $form->id
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Form status is updated successfully'
        ], 200);
    }
    
}
