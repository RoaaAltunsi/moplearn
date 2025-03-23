<?php

namespace App\Http\Controllers;

use App\Http\Resources\FriendshipResource;
use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{
    /**
     * Display user's friends
     */
    public function getFriends(Request $request)
    {
        $userId = $request->input('user_id') ?? Auth::id();
        $perPage = $request->input('size', 9);
        $currentPage = $request->input('page', 1);
        
        // Get all friendships for this user
        $query = Friendship::where(function ($q) use ($userId) {
            $q->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId);
        })
        ->where('status', 'accepted')
        ->with(['sender', 'receiver']);

        // Pagination
        $friendships = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json([
            'friends' => FriendshipResource::collection($friendships),
            'pagination' => [
                'current_page' => $friendships->currentPage(),
                'last_page' => $friendships->lastPage(),
                'per_page' => $friendships->perPage(),
                'total' => $friendships->total(),
            ]
        ]);
    }

    /**
     * Display all received pending requests for authenticated user
     */
    public function getReceivedRequests(Request $request)
    {
        $userId = Auth::id();
        $perPage = $request->input('size', 9);
        $currentPage = $request->input('page', 1);

        // Get pending requests where current user is the receiver
        $query = Friendship::where('receiver_id', $userId)
            ->where('status', 'pending')
            ->with('sender'); // load sender user info

        // pagination
        $requests = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json([
            'requests' => FriendshipResource::collection($requests), // The actual paginated data
            'pagination' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ]
        ]);
    }

    /**
     * Display all sent pending requests for authenticated user
     */
    public function getSentRequests(Request $request)
    {
        $userId = Auth::id();
        $perPage = $request->input('size', 9);
        $currentPage = $request->input('page', 1);

        // Get pending requests where current user is the sender
        $query = Friendship::where('sender_id', $userId)
            ->where('status', 'pending')
            ->with('receiver');
        
        // pagination
        $requests = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json([
            'requests' => FriendshipResource::collection($requests),
            'pagination' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ]
        ]);
    }

    /**
     * Update friendship status
     */
    public function updateStatus(Request $request, $id)
    {
        $newStatus = $request->input('newStatus');
        $friendship = Friendship::findOrFail($id);

        // Check authorization
        if (
            $request->user()->id !== $friendship->receiver_id &&
            $request->user()->id !== $friendship->sender_id
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $friendship->status = $newStatus;
        $friendship->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Friendship status updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy($id)
    {
        $userId = Auth::id();

        $friendship = Friendship::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId);
            })
            ->first();

        if (!$friendship) {
            return response()->json([
                'status' => 'error',
                'message' => 'Friendship not found or access denied'
            ], 404);
        }

        $friendship->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Friendship deleted successfully'
        ]);
    }
}
