<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CustomCorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Allow your frontend domain (adjust as necessary)
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000');  // Replace with your frontend URL
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        // If pre-flight OPTIONS request, return 200 response immediately
        if ($request->getMethod() === "OPTIONS") {
            return response()->json(['status' => 'ok'], 200);
        }

        return $response;
    }
}

