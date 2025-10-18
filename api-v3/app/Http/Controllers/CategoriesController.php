<?php

namespace App\Http\Controllers;

use App\Models\CategoryModel;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(CategoryModel $categoryModel)
	{

		//
		$all        = [];
		$categorias = $categoryModel->allCategories();

		if (isset($categorias)) {
			foreach ($categorias as $c) {
				$all[$c->id_parent][$c->id][] = $c;
			}
		}

		return $all;

	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		echo '===> POST Categorias';
		//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
		echo '===> Categoria ID ' . $id;
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		//
		echo '===> PUT Categoria ID ' . $id;
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		//
		echo '===> DELETE Categoria ID ' . $id;
	}
}
