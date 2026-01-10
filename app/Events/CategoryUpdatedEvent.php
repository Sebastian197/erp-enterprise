<?php

namespace App\Events;

use App\Models\Category;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CategoryUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Category $category;

    /**
     * Create a new event instance.
     */
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        return new PrivateChannel('admin');
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'category.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'description' => $this->category->description,
                'is_active' => $this->category->is_active,
                'group' => $this->category->group ? [
                    'id' => $this->category->group->id,
                    'name' => $this->category->group->name,
                ] : null,
                'users_count' => $this->category->users()->count(),
                'updated_at' => $this->category->updated_at?->toISOString(),
            ],
        ];
    }
}
