<?php

namespace App\Http\Controllers\Api\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\Upload\UploadCvRequest;
use App\Http\Requests\Upload\UploadFileRequest;
use App\Http\Resources\UploadResource;
use App\Models\Upload;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * POST /api/v1/me/portfolio/upload
     *
     * Upload une image vers le stockage.
     * Retourne l'URL publique à stocker dans le content (ex: profile.photo, project.image).
     */
    public function store(UploadFileRequest $request): JsonResponse
    {
        $user      = $request->user();
        $portfolio = $user->portfolio()->firstOrFail();
        $file      = $request->file('file');

        $extension = $file->getClientOriginalExtension();
        $path      = sprintf('portfolios/%s/%s.%s', $portfolio->id, Str::uuid(), $extension);

        $diskName = config('portfolio.upload_disk', env('AWS_ACCESS_KEY_ID') ? 's3' : 'public');

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($diskName);
        $disk->put($path, file_get_contents($file->getRealPath()), 'public');

        $upload = Upload::create([
            'user_id'      => $user->id,
            'portfolio_id' => $portfolio->id,
            'path'         => $path,
            'disk'         => $diskName,
            'mime'         => $file->getMimeType(),
            'size'         => $file->getSize(),
        ]);

        return (new UploadResource($upload))->response()->setStatusCode(201);
    }

    /**
     * POST /api/v1/me/portfolio/upload-cv
     *
     * Upload un CV (PDF). Retourne l'URL à enregistrer dans profile.cv ou profile.links.cv.
     */
    public function storeCv(UploadCvRequest $request): JsonResponse
    {
        $user      = $request->user();
        $portfolio = $user->portfolio()->firstOrFail();
        $file      = $request->file('file');

        $path = sprintf('portfolios/%s/cv/%s.pdf', $portfolio->id, Str::uuid());

        $diskName = config('portfolio.upload_disk', env('AWS_ACCESS_KEY_ID') ? 's3' : 'public');
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($diskName);
        $disk->put($path, file_get_contents($file->getRealPath()), 'public');

        $upload = Upload::create([
            'user_id'      => $user->id,
            'portfolio_id' => $portfolio->id,
            'path'         => $path,
            'disk'         => $diskName,
            'mime'         => $file->getMimeType(),
            'size'         => $file->getSize(),
        ]);

        return (new UploadResource($upload))->response()->setStatusCode(201);
    }

    /**
     * GET /api/v1/me/uploads
     */
    public function index(Request $request): JsonResponse
    {
        $uploads = Upload::where('user_id', $request->user()->id)->latest()->get();

        return UploadResource::collection($uploads)->response();
    }

    /**
     * DELETE /api/v1/me/uploads/{id}
     * Supprime sur S3 et en base.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $upload = Upload::where('user_id', $request->user()->id)->findOrFail($id);

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($upload->disk);
        $disk->delete($upload->path);

        $upload->delete();

        return response()->json(null, 204);
    }
}
