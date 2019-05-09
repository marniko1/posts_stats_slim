<?php

namespace App\Auth;

use App\Models\User;

class Auth {

	public function user() {

		if (isset($_SESSION['user'])) {

			return User::find($_SESSION['user'])->username;
		}
		return false;
	}

	public function check() {

		return isset($_SESSION['user']);
	}

	public function attempt($username, $password) {

		$user = User::where('username', $username)->first();


		if(!$user) {

			return false;
		}

		if (password_get_info($password)['algo'] != 0) {

			if (password_verify($user->password, $password)) {

				return $user;
			}
		} else {

			if ($password == $user->password) {

				$_SESSION['user'] = $user->id;

				return $user;
			}
		}


		return false;
	}

	public function logout() {

		unset($_SESSION['user']);
	}
}