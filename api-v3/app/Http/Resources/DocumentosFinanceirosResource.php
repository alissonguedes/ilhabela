<?php

namespace App\Http\Resources;

use App\Models\FileChunkModel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentosFinanceirosResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request)
	{
		return [
			'id'              => (int) $this->id,
			'tipo'            => $this->tipo,
			'descricao'       => $this->descricao,
			'valor'           => (float) $this->valor,
			'data_emissao'    => (!empty($this->data_emissao) && $this->data_emissao !== '0000-00-00') ? Carbon::parse($this->data_emissao)->format('Y-m-d\TH:i:s') : null,
			'data_vencimento' => (!empty($this->data_vencimento) && $this->data_vencimento != '0000-00-00') ? Carbon::parse($this->data_vencimento)->format('Y-m-d\TH:i:s') : null,
			'data_baixa'      => (!empty($this->data_baixa) && $this->data_baixa !== '0000-00-00') ? Carbon::parse($this->data_baixa)->format('Y-m-d\TH:i:s') : null,
			'status'          => $this->status,
			'user_id'         => (int) $this->user_id,
			'categoria_id'    => $this->categoria_id !== null ? (int) $this->categoria_id : null,
			'conta_id'        => $this->conta_id !== null ? (int) $this->conta_id : null,
			'forma_pagamento' => $this->forma_pagamento,
			'observacoes'     => $this->observacoes,
			// <-- Aqui incluímos os anexos
			'comprovantes' => $this->attachments ? $this->attachments->map(function ($attachment) {
				$file = $attachment->files; // Model único
				return $file ? FileChunkModel::reconstruirImagem($file->chunks, $file->type, $file->name) : null;
			}) : null,

		];
	}
}
