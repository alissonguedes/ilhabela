<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Versão da API
Route::prefix('v3')->group(function () {

	// Rotas públicas
	Route::post('login', [AuthController::class, 'login']);
	Route::post('register', [AuthController::class, 'register']);

	// Rotas protegidas
	Route::middleware('auth:api')->group(function () {

		// Rotas de autenticação
		Route::get('me', [AuthController::class, 'me']);
		Route::post('logout', [AuthController::class, 'logout']);
		Route::post('refresh', [AuthController::class, 'refresh']);

		// Categories
		Route::apiResource('categories', \App\Http\Controllers\CategoriesController::class);

		// Contas a Pagar/Receber
		Route::apiResource('documentos-financeiros', \App\Http\Controllers\DocumentosFinanceirosController::class);

		// Transactions
		Route::apiResource('transactions', \App\Http\Controllers\TransactionsController::class);
		
		// Notes
		Route::apiResource('notes', \App\Http\Controllers\NotesController::class);

	});

});
