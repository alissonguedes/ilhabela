<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
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
			'id'       => (int) $this->id,
			'autor'    => (int) $this->id_autor,
			'assunto'  => $this->assunto,
			'texto'    => $this->texto,
			'status'   => $this->status,
			'data'  => Carbon::parse($this->created_at)->format('Y-m-d\TH:i:s'),
		];
    }
}
