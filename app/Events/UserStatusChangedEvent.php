<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * UserStatusChangedEvent
 *
 * Broadcast event when a user's status changes.
 * Notifies both administrators and the affected user.
 */
class UserStatusChangedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The user whose status changed.
     *
     * @var User
     */
    public User $user;

    /**
     * The old status value.
     *
     * @var string
     */
    public string $oldStatus;

    /**
     * The new status value.
     *
     * @var string
     */
    public string $newStatus;

    /**
     * Create a new event instance.
     *
     * @param User $user
     * @param string $oldStatus
     * @param string $newStatus
     * @return void
     */
    public function __construct(User $user, string $oldStatus, string $newStatus)
    {
        $this->user = $user;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin'),
            new PrivateChannel("user.{$this->user->id}"),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'user.status.changed';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'username' => $this->user->username,
                'email' => $this->user->emails()->where('is_primary', true)->first()?->email,
            ],
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'changed_at' => now()->toISOString(),
        ];
    }
}