<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['title' => 'IT & Software'],
            ['title' => 'Data Science & AI'],
            ['title' => 'Software Development'],
            ['title' => 'Arts & Humanities'],
            ['title' => 'Business'],
            ['title' => 'Science'],
            ['title' => 'Health'],
            ['title' => 'Marketing'],
            ['title' => 'Language Learning'],
            ['title' => 'Design'],
            ['title' => 'Personal Development']
        ];

        Category::insert($categories);
    }
}
