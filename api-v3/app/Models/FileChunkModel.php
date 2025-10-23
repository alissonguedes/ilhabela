<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class FileChunkModel extends Model
{
	protected $table = 'tb_file_chunk';
	protected $primaryKey = 'file_id';
	protected $fillable = ['file_id', 'chunk_id', 'filedata'];

	public $timestamps = false; // se a tabela não tiver created_at / updated_at

	/**
	 * Reconstrói a imagem ou arquivo a partir dos chunks
	 *
	 * @param \Illuminate\Support\Collection $chunks Collection de chunks do arquivo
	 * @param string $type MIME type do arquivo
	 * @param string $name Nome do arquivo
	 * @return array|string Retorna base64 para arquivos não-imagem ou URL direta para imagens
	 */
	public static function reconstruirImagem($chunks, string $type, string $name)
	{
		if ($chunks->isEmpty()) {
			return null;
		}

		// Concatena os chunks em um único binário
		$filedata = '';
		foreach ($chunks as $chunk) {
			$filedata .= $chunk->filedata;
		}

		$mainType = explode('/', $type)[0];

		if ($mainType === 'image') {
			// Para imagens, retorna base64 pronto para exibição em <img>
			$base64 = base64_encode($filedata);
			$src = "data:{$type};base64,{$base64}";

			return [
				'name' => $name,
				'type' => $type,
				'data'  => $src,
			];
		}

		// Para outros arquivos, retorna base64 + metadados
		return [
			'name' => $name,
			'type' => $type,
			'data' => base64_encode($filedata),
			'size' => strlen($filedata),
		];
	}
}
