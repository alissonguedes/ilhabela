<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function login(Request $request)
	{
		//
		$credentials = $request->only('email', 'password');

		if (!$token = JWTAuth::attempt($credentials)) {
			return response()->json(['error' => 'Unauthorized'], 401);
		}

		return $this->respondWithToken($token);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function register(Request $request)
	{
		//
		$user = User::create([
			'name'     => $request->name,
			'email'    => $request->email,
			'password' => Hash::make($request->password),
		]);

		$token = JWTAuth::fromUser($user);

		return $this->respondWithToken($token);

	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function me()
	{
		//
		return response()->json(auth()->user());
	}

	/**
	 * Display the specified resource.
	 */
	public function logout()
	{
		//
		auth()->logout();
		return response()->json(['message' => 'Successfully logged out']);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function refresh()
	{
		//
		return $this->respondWithToken(auth()->refresh());
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function respondWithToken($token)
	{
		//
		return response()->json([
			'user'         => auth()->user(),
			'access_token' => $token,
			'token_type'   => 'bearer',
			'expires_in'   => auth('api')->factory()->getTTL() * 20160,
		]);
	}

}
