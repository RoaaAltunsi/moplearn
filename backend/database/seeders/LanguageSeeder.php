<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            ['language' => 'English'],
            ['language' => 'العربية'],
            ['language' => 'Español'],
            ['language' => 'Português'],
            ['language' => 'Türkçe'],
            ['language' => '日本語'],
            ['language' => 'Français'],
            ['language' => '한국어'],
            ['language' => '中文'],
            ['language' => 'Deutsch'],
            ['language' => 'Русский'],
            ['language' => 'Bahasa Indonesia'],
            ['language' => 'Polski'],
            ['language' => 'Italiano'],
            ['language' => 'ภาษาไทย'],
            ['language' => 'हिन्दी'],
            ['language' => 'اردو'],
            ['language' => 'தமிழ்'],
            ['language' => 'Tiếng Việt'],
            ['language' => 'Українська'],
            ['language' => 'Nederlands']
        ];

        Language::insert($languages);
    }
}
