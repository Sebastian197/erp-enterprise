<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CategoryDeletedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $categoryData;

    /**
     * Create a new event instance.
     */
    public function __construct(array $categoryData)
    {
        $this->categoryData = $categoryData;
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
        return 'category.deleted';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'category' => $this->categoryData,
        ];
    }
}
