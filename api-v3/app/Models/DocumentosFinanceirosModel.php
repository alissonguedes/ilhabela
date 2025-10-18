<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Model;

class DocumentosFinanceirosModel extends Model
{
	//
	protected $table    = 'tb_documentos_financeiros';
	protected $fillable = [
		'tipo', // 'pagar' ou 'receber'
		'descricao',
		'valor',
		'data_emissao',
		'data_vencimento',
		'data_baixa',
		'status', // 'pendente', 'pago', etc.
		'user_id',
		'categoria_id',
		'conta_id',
		'forma_pagamento',
		'observacoes',
	];

	protected $casts = [
		'valor' => MoneyCast::class,
		// 'data_emissao' => 'date',
		// 'data_vencimento' => 'date',
	];
}
