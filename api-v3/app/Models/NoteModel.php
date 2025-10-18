<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteModel extends Model
{
    //
	protected $table = 'tb_nota';
	protected $fillable = [
		'id_autor',
		'assunto', 
		'texto', 
		'status'
	];
	
	protected $casts = [];
}
