<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Money implements Rule
{
	public function passes($attribute, $value)
	{
		// Aceita "1.234,56" ou "1234,56" ou "1234.56"
		return preg_match('/^\d{1,3}(\.\d{3})*(,\d{2})?$/', $value) || preg_match('/^\d+(\.\d{2})?$/', $value);
	}

	public function message()
	{
		return 'O campo :attribute deve estar em um formato monetário válido (ex: 1.234,56).';
	}
}
