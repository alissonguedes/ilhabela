<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		// return parent::toArray($request);

		return [
			'id'           => (int) $this->id,
			'id_parent'    => (int) $this->id_parent,
			'tituloParent' => $this->when(isset($this->tituloParent), $this->tituloParent == $this->id),
			'titulo'       => $this->titulo,
			// 'titulo_slug'  => $this->titulo_slug,
			// 'descricao'    => $this->descricao,
			// 'status'       => $this->status,
			// 'imagem'       => $this->imagem,
			// 'ordem'        => (int) $this->ordem,
			// 'icone'        => $this->icone,
			// 'color'        => $this->color,
			// 'text_color'   => $this->text_color,
		];

	}
}
