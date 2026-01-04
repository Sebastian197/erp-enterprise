<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * SystemNotificationEvent
 *
 * Broadcast system notifications to specific users.
 * Types: info, success, warning, error
 */
class SystemNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The notification message.
     *
     * @var string
     */
    public string $message;

    /**
     * The notification type (info, success, warning, error).
     *
     * @var string
     */
    public string $type;

    /**
     * Additional notification data.
     *
     * @var array<string, mixed>
     */
    public array $data;

    /**
     * The user ID to send the notification to.
     *
     * @var int
     */
    protected int $userId;

    /**
     * Create a new event instance.
     *
     * @param int $userId
     * @param string $message
     * @param string $type
     * @param array<string, mixed> $data
     * @return void
     */
    public function __construct(int $userId, string $message, string $type = 'info', array $data = [])
    {
        $this->userId = $userId;
        $this->message = $message;
        $this->type = $type;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel("notifications.{$this->userId}");
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'system.notification';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'type' => $this->type,
            'data' => $this->data,
            'timestamp' => now()->toISOString(),
        ];
    }
}