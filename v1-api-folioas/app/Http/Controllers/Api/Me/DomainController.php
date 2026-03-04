<?php

namespace App\Http\Controllers\Api\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Domain\StoreDomainRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DomainController extends Controller
{
    /**
     * GET /api/v1/me/domains
     */
    public function index(Request $request): JsonResponse
    {
        $domains = $request->user()->portfolio()->firstOrFail()->domains;

        return response()->json($domains);
    }

    /**
     * POST /api/v1/me/domains
     * Enregistre un domaine custom.
     * Retourne le token DNS TXT à configurer pour la vérification.
     */
    public function store(StoreDomainRequest $request): JsonResponse
    {
        $portfolio = $request->user()->portfolio()->firstOrFail();
        $token     = Str::random(32);

        $domain = $portfolio->domains()->create([
            'domain'             => $request->domain,
            'verification_token' => $token,
            'status'             => 'pending',
        ]);

        return response()->json([
            'id'                => $domain->id,
            'domain'            => $domain->domain,
            'status'            => $domain->status,
            'verificationToken' => $token,
            'dnsRecord'         => [
                'type'  => 'TXT',
                'name'  => "_verify.{$domain->domain}",
                'value' => $token,
            ],
        ], 201);
    }

    /**
     * POST /api/v1/me/domains/{id}/verify
     * Vérifie l'enregistrement DNS TXT.
     */
    public function verify(Request $request, int $id): JsonResponse
    {
        $portfolio  = $request->user()->portfolio()->firstOrFail();
        $domain     = $portfolio->domains()->findOrFail($id);
        $txtHost    = '_verify.' . $domain->domain;
        $dnsRecords = @dns_get_record($txtHost, DNS_TXT) ?: [];

        $verified = collect($dnsRecords)
            ->contains(fn ($r) => ($r['txt'] ?? '') === $domain->verification_token);

        $domain->update(['status' => $verified ? 'verified' : 'rejected']);

        return response()->json([
            'id'     => $domain->id,
            'domain' => $domain->domain,
            'status' => $domain->status,
        ]);
    }

    /**
     * DELETE /api/v1/me/domains/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $request->user()
            ->portfolio()->firstOrFail()
            ->domains()->findOrFail($id)
            ->delete();

        return response()->json(null, 204);
    }
}
