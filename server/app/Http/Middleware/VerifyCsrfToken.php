<?php


namespace App\Http\Middleware;

use App\Http\Controllers\Api\ImageController as ApiImageController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Routing\Route;
use ImageController;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        // Add your routes here if you want to exclude them from CSRF verification
        'api/*',
        'images',
        'sanctum/csrf-cookie',
        Route::post('/images', [ImageController::class, 'store']),
        Route::post('/images', [ApiImageController::class, 'store'])
    ];
}