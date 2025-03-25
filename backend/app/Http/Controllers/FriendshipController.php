<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFriendshipRequest;
use App\Http\Resources\FriendshipResource;
use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class FriendshipController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFriendshipRequest $request)
    {
        try {
            $senderId = Auth::id();
            $receiverId = $request->input('receiver_id');

            DB::beginTransaction();
            $friendship = Friendship::create([
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'status' => 'pending'
            ]);
            DB::commit();

            return response()->json([
                'message' => 'Friend request sent',
                'friendship_id' => $friendship->id,
            ], 201);
            
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong. Please try again later'
            ], 500);
        }
    }

    /**
     * Display paginated friends
     */
    public function getFriends(Request $request, $id)
    {
        $userId = $id;
        $perPage = $request->input('size');
        $currentPage = $request->input('page');
        
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
            'friends' => $friendships->getCollection()->map(fn($f) => (new FriendshipResource($f, $userId))->toArray($request)),
            'pagination' => [
                'current_page' => $friendships->currentPage(),
                'last_page' => $friendships->lastPage(),
                'per_page' => $friendships->perPage(),
                'total' => $friendships->total(),
            ]
        ]);
    }

    /**
     * Display all summaries of friends for the authenticatd user
     */
    public function getFriendsSummaries($id)
    {
        $userId = $id;
        
        // Get all friendships for this user
        $friendships = Friendship::where(function ($q) use ($userId) {
            $q->where('sender_id', $userId)
                ->orWhere('receiver_id', $userId);
        })
        ->where('status', 'accepted')
        ->get();

        // Extract both friendship ID and user ID (the one who is NOT the authenticated user)
        $friendIds = $friendships->map(function ($f) use ($userId) {
            return [
                'id' => $f->id, // friendship id
                'user_id' => $f->sender_id == $userId ? $f->receiver_id : $f->sender_id
            ];
        });

        return response()->json($friendIds);
    }

    /**
     * Display paginated received requests for the authenticated user
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
            'requests' => $requests->getCollection()->map(fn($f) => (new FriendshipResource($f, $userId))->toArray($request)),
            'pagination' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ]
        ]);
    }

    /**
     * Display all summaries of received requests for the authenticatd user
     */
    public function getReceivedRequestsSummaries()
    {
        $userId = Auth::id();

        // Get pending requests where current user is the receiver
        $requests = Friendship::where('receiver_id', $userId)
            ->where('status', 'pending')
            ->get();

        // Extract both friendship ID and sender ID
        $requestIds = $requests->map(function ($f) {
            return [
                'id' => $f->id, // friendship id
                'user_id' => $f->sender_id
            ];
        });

        return response()->json($requestIds);
    }

    /**
     * Display paginated sent requests for the authenticated user
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
            'requests' => $requests->getCollection()->map(fn($f) => (new FriendshipResource($f, $userId))->toArray($request)),
            'pagination' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ]
        ]);
    }

    /**
     * Display all summaries of sent requests for the authenticatd user
     */
    public function getSentRequestsSummaries()
    {
        $userId = Auth::id();

        // Get pending requests where current user is the receiver
        $requests = Friendship::where('sender_id', $userId)
            ->where('status', 'pending')
            ->get();

        // Extract both friendship ID and receiver ID
        $requestIds = $requests->map(function ($f) {
            return [
                'id' => $f->id, // friendship id
                'user_id' => $f->receiver_id
            ];
        });

        return response()->json($requestIds);
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
