<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

define('CHUNK_SIZE', 128 * 500); // 64 KB aprox

class FileModel extends Model
{
	protected $table = 'tb_file';

	protected $fillable = [
		'ft',
		'type',
		'size',
		'key',
		'signature',
		'name',
		'attrs',
	];


	public function chunks()
	{
		return $this->hasMany(FileChunkModel::class, 'file_id')->orderBy('chunk_id', 'asc');
	}

	/**
	 * Cria um arquivo, grava chunks e evita duplicação pelo hash
	 *
	 * @param \Illuminate\Http\UploadedFile $object
	 * @param string $ft
	 * @return int|null file_id
	 */
	public static function createFile($object, string $ft = 'T'): ?int
	{
		if (empty($object)) return null;

		$file['name']      = $object->getClientOriginalName();
		$file['type']      = $object->getClientMimeType();
		$file['size']      = $object->getSize();
		$file['tmp']       = $object->getPathName();
		list($key, $signature) = self::_getKeyAndHash($file['tmp'], true);
		$file['key']       = $key;
		$file['signature'] = $signature;
		$file['ft']        = $ft;

		// verifica duplicidade pelo hash
		$existing = self::where('signature', $file['signature'])->first();
		if ($existing) {
			return $existing->id;
		}

		// insere novo arquivo
		$file_id = self::insertGetId([
			'name'      => $file['name'],
			'type'      => $file['type'],
			'size'      => $file['size'],
			'key'       => $file['key'],
			'signature' => $file['signature'],
			'ft'        => $file['ft'],
		]);

		// grava chunks
		self::writeFileChunks($file_id, $file);

		return $file_id;
	}

	/**
	 * Grava arquivo em chunks
	 *
	 * @param int $file_id
	 * @param array $file
	 * @param int $chunkSize
	 * @return int quantidade de chunks gravados
	 */
	private static function writeFileChunks(int $file_id, array $file, int $chunkSize = CHUNK_SIZE): int
	{
		// remove chunks existentes, se houver
		DB::table('tb_file_chunk')->where('file_id', $file_id)->delete();

		$fp = fopen($file['tmp'], 'rb');
		if (!$fp) return 0;

		$chunkId = 0;
		while (!feof($fp)) {
			$data = fread($fp, $chunkSize);
			if ($data === false) break;

			DB::table('tb_file_chunk')->insert([
				'file_id'  => $file_id,
				'chunk_id' => $chunkId++,
				'filedata' => $data
			]);
		}

		fclose($fp);
		return $chunkId;
	}

	/**
	 * Remove arquivos e seus chunks
	 * Só deleta se não houver anexos restantes
	 *
	 * @param array $fileIds
	 * @return void
	 */
	public static function remove(array $fileIds): void
	{
		foreach ($fileIds as $id) {
			$hasAttachments = DB::table('tb_attachment')->where('file_id', $id)->exists();
			if (!$hasAttachments) {
				DB::table('tb_file_chunk')->where('file_id', $id)->delete();
				self::where('id', $id)->delete();
			}
		}
	}

	/**
	 * Gera key e hash de assinatura
	 *
	 * @param string $filePath
	 * @param bool $isFile
	 * @return array [$key, $hash]
	 */
	private static function _getKeyAndHash($data, bool $isFile = false): array
	{
		if ($isFile) {
			$sha1 = base64_encode(sha1_file($data, true));
			$md5  = base64_encode(md5_file($data, true));
		} else {
			$sha1 = base64_encode(sha1($data, true));
			$md5  = base64_encode(md5($data, true));
		}

		$prefix = base64_encode(sha1(microtime(), true));
		$key    = str_replace(['=', '+', '/'], ['', '-', '_'], substr($prefix, 0, 5) . $sha1);
		$hash   = str_replace(['=', '+', '/'], ['', '-', ' '], substr($sha1, 0, 16) . substr($md5, 0, 16));

		return [$key, $hash];
	}
}
