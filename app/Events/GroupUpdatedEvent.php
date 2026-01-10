<?php

namespace App\Events;

use App\Models\Group;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Group $group;

    /**
     * Create a new event instance.
     */
    public function __construct(Group $group)
    {
        $this->group = $group;
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
        return 'group.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'group' => [
                'id' => $this->group->id,
                'name' => $this->group->name,
                'description' => $this->group->description,
                'is_active' => $this->group->is_active,
                'users_count' => $this->group->users()->count(),
                'categories_count' => $this->group->categories()->count(),
                'updated_at' => $this->group->updated_at?->toISOString(),
            ],
        ];
    }
}
