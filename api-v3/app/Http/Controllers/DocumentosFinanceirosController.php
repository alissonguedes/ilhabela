<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentosFinanceirosResource;
use App\Models\DocumentosFinanceirosModel;
use App\Rules\Money;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\AttachmentModel;
use Illuminate\Validation\Rule;

class DocumentosFinanceirosController extends Controller
{
	/**
	 * Exibe a lista de documentos financeiros.
	 */
	public function index(Request $request): JsonResponse
	{
		$query = DocumentosFinanceirosModel::with('attachments');

		$query
			->when($request->filled('tipo'), fn($q) => $q->where('tipo', $request->input('tipo')))
			->when($request->filled('status'), fn($q) => $q->where('status', $request->input('status')))
			->when($request->filled('cliente_id'), fn($q) => $q->where('cliente_id', $request->input('cliente_id')))
			->when($request->filled('periodo'), fn($q) => $q->whereRaw('DATE_FORMAT(data_vencimento, "%Y-%m") = ?', [$request->input('periodo')]))
			->when(
				$request->filled('search'),
				fn($q) =>
				$q->where(function ($sub) use ($request) {
					$search = '%' . $request->input('search') . '%';
					$sub->where('descricao', 'LIKE', $search)->orWhere('documento', 'LIKE', $search);
				})
			);
		$documentos = $query->orderBy('data_vencimento', 'desc')->get();

		return response()->json(
			DocumentosFinanceirosResource::collection($documentos)
		);
	}

	/**
	 * Armazena um novo documento financeiro.
	 */
	public function store(Request $request): JsonResponse
	{

		$validated = $request->validate([
			'tipo'			  => 'required',
			'descricao'       => 'required|string|max:255',
			'valor'           => ['required', new Money],
			'data_vencimento' => 'required|date',
			'status'          => 'required',
			'comprovante'     => Rule::requiredIf($request->tipo === 'pagar'),
			'observacoes'     => 'nullable',
		]);

		$documento = DocumentosFinanceirosModel::create($validated);

		if (isset($validated['comprovante']) && $validated['comprovante']) {
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
