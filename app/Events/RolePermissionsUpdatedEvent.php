<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Spatie\Permission\Models\Role;

class RolePermissionsUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Role $role;

    /**
     * Create a new event instance.
     */
    public function __construct(Role $role)
    {
        $this->role = $role;
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
        return 'role.permissions.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'role' => [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'permissions' => $this->role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'guard_name' => $permission->guard_name,
                    ];
                })->toArray(),
                'permissions_count' => $this->role->permissions->count(),
                'updated_at' => $this->role->updated_at?->toISOString(),
            ],
        ];
    }
}
