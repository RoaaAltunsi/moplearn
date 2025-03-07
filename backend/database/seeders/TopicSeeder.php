<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            ['title' => 'Cloud Computing', 'category_id' => 1], // Category: IT & Software
            ['title' => 'Security', 'category_id' => 1],
            ['title' => 'Networking', 'category_id' => 1],
            ['title' => 'Operating Systems', 'category_id' => 1],

            ['title' => 'Data Analysis', 'category_id' => 2], // Category: Data Science & AI
            ['title' => 'Big Data', 'category_id' => 2],
            ['title' => 'Artificial Intelligence', 'category_id' => 2],
            ['title' => 'Machine Learning', 'category_id' => 2],
            ['title' => 'Business Intelligence', 'category_id' => 2],
            ['title' => 'Probability & Statistics', 'category_id' => 2],

            ['title' => 'Web Development', 'category_id' => 3], // Category: Software Development
            ['title' => 'App Development', 'category_id' => 3],
            ['title' => 'Game Development', 'category_id' => 3],
            ['title' => 'Software Testing', 'category_id' => 3],
            ['title' => 'Programming Languages', 'category_id' => 3],
            ['title' => 'Database Design & Development', 'category_id' => 3],

            ['title' => 'History', 'category_id' => 4], // Category: Art & Humanities
            ['title' => 'Philosophy', 'category_id' => 4],
            ['title' => 'Music', 'category_id' => 4],
            ['title' => 'Journalism', 'category_id' => 4],

            ['title' => 'Leadership & Management', 'category_id' => 5], // Category: Business
            ['title' => 'Entrepreneurship', 'category_id' => 5],
            ['title' => 'Project Management', 'category_id' => 5],
            ['title' => 'Human Resource', 'category_id' => 5],
            ['title' => 'Finance', 'category_id' => 5],

            ['title' => 'Physics & Astronomy', 'category_id' => 6], // Category: Science
            ['title' => 'Chemistry', 'category_id' => 6],
            ['title' => 'Engineering', 'category_id' => 6],
            ['title' => 'Environmental Science & Sustainability', 'category_id' => 6],

            ['title' => 'Psychology', 'category_id' => 7], // Category: Health
            ['title' => 'Healthcare Management', 'category_id' => 7],
            ['title' => 'Fitness', 'category_id' => 7],
            ['title' => 'Nutrition', 'category_id' => 7],

            ['title' => 'Search Engine Optimization', 'category_id' => 8], // Category: Marketing
            ['title' => 'Digital Marketing', 'category_id' => 8],
            ['title' => 'Branding', 'category_id' => 8],

            ['title' => 'English', 'category_id' => 9], // Category: Language Learning
            ['title' => 'Chinese', 'category_id' => 9],
            ['title' => 'Korean', 'category_id' => 9],
            ['title' => 'Arabic', 'category_id' => 9],

            ['title' => 'Graphic Design', 'category_id' => 10], // Category: Design
            ['title' => '3D & Animation', 'category_id' => 10],
            ['title' => 'User Experience Design', 'category_id' => 10],

            ['title' => 'Memory & Study Skills', 'category_id' => 11], // Category: Personal Development
            ['title' => 'Parenting & Relationships', 'category_id' => 11],
        ];

        Topic::insert($topics);
    }
}
