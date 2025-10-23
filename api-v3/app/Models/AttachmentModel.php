<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttachmentModel extends Model
{
	//
	protected $table = 'tb_attachment';

	protected $fillable = [
		'object_id',
		'type',
		'file_id',
		'name',
		'inline',
		'lang'
	];

	public function files()
	{
		return $this->belongsTo(FileModel::class, 'file_id', 'id')->with('chunks');
	}

	public static function add($files, $object_id, $type)
	{

		self::where('object_id', $object_id)->delete();

		$files = is_array($files) ? $files : [$files];
		$attachmentIds = [];

		foreach ($files as $file) {
			$file_id = FileModel::createFile($file, $type);
			if ($file_id) {
				$attachment = self::updateOrCreate(
					['object_id' => $object_id, 'type' => $type, 'file_id' => $file_id],
					[
						'file_id' => $file_id,
						'name'    => $file->getClientOriginalName()
					]
				);
				$attachmentIds[] = $attachment->id;
			}
		}

		return $attachmentIds;
	}
}
