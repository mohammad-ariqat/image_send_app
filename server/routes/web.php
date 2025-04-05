<?php

use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;
use ImageController as GlobalImageController;

Route::get('/', function () {
    return view('welcome');
});
Route::post('/images', [GlobalImageController::class, 'store']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token set']);
});
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
