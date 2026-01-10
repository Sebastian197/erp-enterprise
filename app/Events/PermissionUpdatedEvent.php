<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\Permission\Models\Permission;

class PermissionUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Permission $permission;

    /**
     * Create a new event instance.
     */
    public function __construct(Permission $permission)
    {
        $this->permission = $permission;
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
        return 'permission.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'permission' => [
                'id' => $this->permission->id,
                'name' => $this->permission->name,
                'guard_name' => $this->permission->guard_name,
                'updated_at' => $this->permission->updated_at?->toISOString(),
            ],
        ];
    }
}
