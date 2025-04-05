<?php
use App\Http\Controllers\Api\ImageController;
use Illuminate\Routing\Route;

Route::post('/images', [ImageController::class, 'store']);


?>