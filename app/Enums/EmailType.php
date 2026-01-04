<?php

namespace App\Enums;

enum EmailType: string
{
    case PRIMARY = 'primary';
    case WORK = 'work';
    case PERSONAL = 'personal';
    case RECOVERY = 'recovery';

    public function label(): string
    {
        return match ($this) {
            self::PRIMARY => 'Primary',
            self::WORK => 'Work',
            self::PERSONAL => 'Personal',
            self::RECOVERY => 'Recovery',
        };
    }
}
