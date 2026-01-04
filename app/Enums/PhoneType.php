<?php

namespace App\Enums;

enum PhoneType: string
{
    case EXTENSION = 'extension';
    case CASA = 'casa';
    case PERSONAL = 'personal';
    case TRABAJO = 'trabajo';

    public function label(): string
    {
        return match ($this) {
            self::EXTENSION => 'Extension',
            self::CASA => 'Home',
            self::PERSONAL => 'Personal',
            self::TRABAJO => 'Work',
        };
    }
}