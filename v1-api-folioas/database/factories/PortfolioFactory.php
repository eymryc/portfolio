<?php

namespace Database\Factories;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Portfolio>
 */
class PortfolioFactory extends Factory
{
    protected $model = Portfolio::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'slug'             => fake()->unique()->slug(),
            'template_id'       => 'v1',
            'template_version'  => null,
            'content'          => Portfolio::emptyContent(),
            'is_public'        => false,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => ['is_public' => true]);
    }
}
