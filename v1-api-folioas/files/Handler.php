<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = ['current_password', 'password', 'password_confirmation'];

    public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return $this->toJsonResponse($e);
            }
        });
    }

    private function toJsonResponse(Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => 'Les données envoyées sont invalides.',
                'errors'  => $e->errors(),
            ], 422);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json(['message' => 'Ressource introuvable.'], 404);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        $status  = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
        $message = app()->isProduction() ? 'Une erreur interne est survenue.' : $e->getMessage();

        return response()->json(['message' => $message], $status);
    }
}
