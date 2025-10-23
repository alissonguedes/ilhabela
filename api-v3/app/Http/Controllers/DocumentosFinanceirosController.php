<?php

namespace App\Http\Controllers;

use App\Casts\MoneyCast;
use App\Http\Resources\DocumentosFinanceirosResource;
use App\Models\DocumentosFinanceirosModel;
use App\Rules\Money;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\AttachmentModel;

class DocumentosFinanceirosController extends Controller
{
	/**
	 * Exibe a lista de documentos financeiros.
	 */
	public function index(Request $request): JsonResponse
	{
		$tipo = $request->tipo ?? null;
		$documentos = DocumentosFinanceirosModel::with('attachments')->where('tipo', $tipo)->get();
		return response()->json(DocumentosFinanceirosResource::collection($documentos));
	}

	/**
	 * Armazena um novo documento financeiro.
	 */
	public function store(Request $request, MoneyCast $money): JsonResponse
	{

		$validated = $request->validate([
			'tipo'			  => 'required',
			'descricao'       => 'required|string|max:255',
			'valor'           => ['required', new Money],
			'data_vencimento' => 'required|date',
			'status'          => 'required',
			'comprovante'     => 'required',
			'observacoes'     => 'nullable',
		]);

		$documento = DocumentosFinanceirosModel::create($validated);

		if ($validated['comprovante']) {
			AttachmentModel::add($request->file('comprovante'), $documento->id, 'transaction');
		}

		return response()->json([
			'data'    => new DocumentosFinanceirosResource($documento),
			'message' => 'Registro criado com sucesso!',
		], 201);
	}

	/**
	 * Exibe um documento financeiro específico.
	 */
	public function show(int $id): JsonResponse
	{
		$documento = DocumentosFinanceirosModel::find($id);

		if (!$documento) {
			return response()->json(['message' => 'Registro não encontrado.'], 404);
		}

		return response()->json(new DocumentosFinanceirosResource($documento));
	}

	/**
	 * Atualiza um documento financeiro existente.
	 */
	public function update(Request $request, int $id): JsonResponse
	{

		$documento = DocumentosFinanceirosModel::find($id);

		if (!$documento) {
			return response()->json(['message' => 'Registro não encontrado.'], 404);
		}

		$validated = $request->validate([
			'tipo'			  => 'required',
			'descricao'       => 'required|string|max:255',
			'valor'           => ['required', new Money],
			'data_vencimento' => 'required|date',
			'status'          => 'required',
			'comprovante'     => 'nullable',
			'observacoes'     => 'nullable',
		]);

		$documento->fill($validated);

		if ($validated['comprovante']) {
			AttachmentModel::add($request->file('comprovante'), $id, 'transaction');
		}

		if (!$documento->save()) {
			return response()->json(['message' => 'Erro ao tentar atualizar o registro.'], 400);
		}

		return response()->json([
			'data'    => new DocumentosFinanceirosResource($documento),
			'message' => 'Registro atualizado com sucesso!',
		]);
	}

	/**
	 * Remove um documento financeiro.
	 */
	public function destroy(int $id): JsonResponse
	{
		$documento = DocumentosFinanceirosModel::find($id);

		if (!$documento) {
			return response()->json(['message' => 'Registro não encontrado.'], 404);
		}

		if (!$documento->delete()) {
			return response()->json(['message' => 'Erro ao tentar excluir o registro.'], 409);
		}

		AttachmentModel::where('object_id', $id)->where('type', 'transaction')->delete();

		return response()->json(['message' => 'Registro excluído com sucesso!']);
	}
}
