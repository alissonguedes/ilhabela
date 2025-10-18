<?php

namespace App\Http\Controllers;

use App\Models\NoteModel;
use App\Http\Resources\NoteResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
		// $avisos = NoteModel::where('status', 'published')->get();
		$avisos = NoteModel::get();
		
		return response()->json(NoteResource::collection($avisos));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
		$validated = $request->validate([
			'assunto'   => 'required|max:255',
			'texto'     => 'required',
			'status'    => 'required'
		]);
		
		$validated['id_autor'] = $request->user_id;
		
		$created = NoteModel::create($validated);
		
		return response()->json([
			'data'    => new NoteResource($created),
			'message' => 'Nota adicionada com sucesso!'
		], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(NoteModel $noteModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        //
		$note = NoteModel::find($id);
		
		if (! $note) {
			return response()->json(['message'=>'Registro não encontrado'], 404);
		}
		
		$validated = $request->validate([
			'assunto'   => 'required|max:255',
			'texto'     => 'required',
			'status'    => 'required'
		]);
		
		$validated['id_autor'] = $request->user_id;
		
		$note->fill($validated);
		
		if(!$note->save()){
			return response()->json(['message'=> 'Erro ao tentar atualizar o registro'], 400);
		}
		
		return response()->json([
			'data'    => new NoteResource($note),
			'message' => 'Nota atualizada com sucesso!'
		], 201);
		
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        //
		$note = NoteModel::find($id);
		
		if(!$note){
			return response()-> json(['message' => 'Registro não encontrado'], 404);
		}
		
		if(!$note->delete()){
			return response()->json(['message' => 'Erro ao tentar excluir o registro.'], 409);
		}
		
		return response()-> json(['message'=> 'Registro excluído com sucesso!']);
    }
}
