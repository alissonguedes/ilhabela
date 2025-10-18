<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ETagMiddleware
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{

		$response = $next($request);

		// Só aplica em respostas JSON ou Texto
		if (!$response->isSuccessful() || !preg_match('#^application/json|text/html|text/plain#', $response->headers->get('Content-Type'))) {
			return $response;
		}

		// Gera o hash ETag baseado no conteúdo da resposta
		$etag = md5($response->getContent());

		// Normaliza os ETags recebidos do cliente:
		// 1. Remove aspas
		// 2. Remove sufixo '-gzip' se existir
		$clientEtags = array_map(function ($e) {
			return preg_replace('/-gzip$/', '', trim($e, '"'));
		}, $request->getETags());

		Log::info('----------------');
		Log::info('E-tag do back-end: ' . $etag);
		Log::info('E-tag Client: ', $clientEtags);
		Log::info('Comparando com: ' . $etag);
		Log::info('Todos os headers:', $request->headers->all());
		Log::info('----------------');

		if (in_array($etag, $clientEtags, true)) {
			Log::info('--------------------Bateu. Retornando 304--------------------');
			return response('', 304)->setEtag($etag);
		}

		Log::info('ETag diferente, retornando 200');

		// Define o ETag na resposta
		return $response->setEtag($etag);

	}
}
