<?php

namespace Tests\Feature\Portfolio;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_portfolio(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/me/portfolio', [
            'slug'        => 'jean-dupont',
            'template_id' => 'classic',
        ])->assertStatus(201)
            ->assertJsonFragment(['slug' => 'jean-dupont', 'isPublic' => false]);
    }

    public function test_cannot_create_duplicate_portfolio(): void
    {
        $user = User::factory()->create();
        Portfolio::factory()->for($user)->create();

        $this->actingAs($user)->postJson('/api/v1/me/portfolio', [
            'slug'        => 'autre-slug',
            'template_id' => 'classic',
        ])->assertStatus(409);
    }

    public function test_user_can_change_template(): void
    {
        $user      = User::factory()->create();
        $portfolio = Portfolio::factory()->for($user)->create();

        $this->actingAs($user)->patchJson('/api/v1/me/portfolio/template', [
            'template_id' => 'minimal',
        ])->assertOk()->assertJsonFragment(['templateId' => 'minimal']);
    }

    public function test_user_can_publish_portfolio(): void
    {
        $user      = User::factory()->create();
        $portfolio = Portfolio::factory()->for($user)->create(['is_public' => false]);

        $this->actingAs($user)->patchJson('/api/v1/me/portfolio/visibility', [
            'is_public' => true,
        ])->assertOk()->assertJsonFragment(['isPublic' => true]);
    }

    public function test_public_portfolio_is_accessible(): void
    {
        $portfolio = Portfolio::factory()->create([
            'is_public' => true,
            'content'   => Portfolio::emptyContent(),
        ]);

        $this->getJson("/api/v1/portfolios/{$portfolio->slug}")
            ->assertOk()
            ->assertJsonStructure(['templateId', 'templateVersion', 'content']);
    }

    public function test_private_portfolio_is_not_accessible(): void
    {
        $portfolio = Portfolio::factory()->create(['is_public' => false]);

        $this->getJson("/api/v1/portfolios/{$portfolio->slug}")
            ->assertStatus(404);
    }

    public function test_user_can_delete_portfolio(): void
    {
        $user      = User::factory()->create();
        $portfolio = Portfolio::factory()->for($user)->create();

        $this->actingAs($user)->deleteJson('/api/v1/me/portfolio')
            ->assertStatus(204);

        $this->assertDatabaseMissing('portfolios', ['id' => $portfolio->id]);
    }
}
