<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * WelcomeNotification
 *
 * Sent to new users after account creation.
 * Includes welcome message and login instructions.
 */
class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The user receiving the welcome notification.
     *
     * @var User
     */
    protected User $user;

    /**
     * Create a new notification instance.
     *
     * @param User $user
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        $loginUrl = config('app.url') . '/login';

        return (new MailMessage)
            ->subject('Welcome to ' . config('app.name'))
            ->greeting("Hello {$this->user->name}!")
            ->line('Welcome to ' . config('app.name') . '. Your account has been successfully created.')
            ->line('You can now login using your username and the password provided by your administrator.')
            ->line('**Username:** ' . $this->user->username)
            ->action('Login Now', $loginUrl)
            ->line('If you have any questions or need assistance, please contact your system administrator.')
            ->line('Thank you for joining us!');
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @param mixed $notifiable
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'type' => 'welcome',
            'title' => 'Welcome to ' . config('app.name'),
            'message' => "Welcome {$this->user->name}! Your account has been successfully created.",
            'user_id' => $this->user->id,
            'username' => $this->user->username,
            'created_at' => now()->toISOString(),
        ];
    }
}