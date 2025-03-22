<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserSummaryResource;
use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class FriendshipController extends Controller
{
    /**
     * Display user's partners
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
        $paginatedFriendships = $query->paginate($perPage, ['*'], 'page', $currentPage);

        // Map the results to only return the friend (not the current user)
        $mappedFriends = $paginatedFriendships->getCollection()->map(function ($friendship) use ($userId) {
            return $friendship->sender_id == $userId ? $friendship->receiver : $friendship->sender;
        });

        // Wrap mapped collection back in paginator
        $finalPaginated = new LengthAwarePaginator(
            $mappedFriends,
            $paginatedFriendships->total(),
            $paginatedFriendships->perPage(),
            $paginatedFriendships->currentPage(),
            ['path' => url()->current()]
        );

        return response()->json([
            'friends' => UserSummaryResource::collection($finalPaginated),
            'pagination' => [
                'current_page' => $finalPaginated->currentPage(),
                'last_page' => $finalPaginated->lastPage(),
                'per_page' => $finalPaginated->perPage(),
                'total' => $finalPaginated->total(),
            ]
        ]);
    }
}
