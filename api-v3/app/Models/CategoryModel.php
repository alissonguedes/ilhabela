<?php

namespace App\Models;

use App\Http\Resources\CategoryResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryModel extends Model
{

	/** @use HasFactory<\Database\Factories\CategoryModelFactory> */
	use HasFactory;

	protected $table = 'tb_categoria';

	public function allCategories()
	{
		$c = $this->where('status', '1')->get();
		return CategoryResource::collection($c);
	}

}
