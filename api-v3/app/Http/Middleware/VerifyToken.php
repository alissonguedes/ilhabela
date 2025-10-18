<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyToken
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{

		$token  = $request->header('x-webhook-token');
		$secret = config('jwt.secret');

		if (!$token || $token !== $secret) {
			return response('Token inválido', 403);
		}

		return $next($request);
	}
}
