<?php

namespace Tests\Feature\Section;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SectionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Portfolio $portfolio;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user      = User::factory()->create();
        $this->portfolio = Portfolio::factory()->for($this->user)->create([
            'content' => Portfolio::emptyContent(),
        ]);
    }

    public function test_can_read_profile_section(): void
    {
        $this->actingAs($this->user)
            ->getJson('/api/v1/me/portfolio/sections/profile')
            ->assertOk()
            ->assertJsonStructure(['name', 'title', 'bio', 'photo', 'links']);
    }

    public function test_can_replace_profile_section(): void
    {
        $this->actingAs($this->user)
            ->putJson('/api/v1/me/portfolio/sections/profile', [
                'data' => [
                    'name'  => 'Jean Dupont',
                    'title' => 'Développeur Full Stack',
                    'bio'   => 'Passionné de code.',
                    'photo' => null,
                    'links' => ['github' => 'https://github.com/jean'],
                ],
            ])->assertOk()
            ->assertJsonFragment(['name' => 'Jean Dupont']);
    }

    public function test_can_add_experience(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/me/portfolio/sections/experiences/items', [
                'role'    => 'Développeur Senior',
                'company' => 'Acme Corp',
                'period'  => '2022 - Présent',
                'current' => true,
            ])->assertStatus(201)
            ->assertJsonStructure(['id', 'role', 'company']);

        $this->assertNotNull($response->json('id'));
    }

    public function test_can_update_experience(): void
    {
        // Seed une expérience
        $itemId    = \Str::uuid();
        $content   = Portfolio::emptyContent();
        $content['experiences'][] = ['id' => $itemId, 'role' => 'Dev Jr', 'company' => 'Old Co'];
        $this->portfolio->update(['content' => $content]);

        $this->actingAs($this->user)
            ->putJson("/api/v1/me/portfolio/sections/experiences/items/{$itemId}", [
                'role'    => 'Dev Senior',
                'company' => 'New Co',
            ])->assertOk()
            ->assertJsonFragment(['role' => 'Dev Senior', 'company' => 'New Co']);
    }

    public function test_can_delete_experience(): void
    {
        $itemId  = \Str::uuid();
        $content = Portfolio::emptyContent();
        $content['experiences'][] = ['id' => $itemId, 'role' => 'Dev', 'company' => 'Co'];
        $this->portfolio->update(['content' => $content]);

        $this->actingAs($this->user)
            ->deleteJson("/api/v1/me/portfolio/sections/experiences/items/{$itemId}")
            ->assertStatus(204);

        $this->portfolio->refresh();
        $this->assertEmpty($this->portfolio->content['experiences']);
    }

    public function test_invalid_section_returns_422(): void
    {
        $this->actingAs($this->user)
            ->getJson('/api/v1/me/portfolio/sections/invalid_section')
            ->assertStatus(422);
    }

    public function test_object_section_rejects_item_store(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/v1/me/portfolio/sections/profile/items', [])
            ->assertStatus(422);
    }
}
