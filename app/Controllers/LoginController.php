<?php

namespace App\Controllers;

use \Firebase\JWT\JWT;
use Slim\Views\Twig as View;

class LoginController extends Controller {

	public function getLogin($request, $response) {

		return $this->view->render($response, 'login.twig');
	}

	public function postLogin($request, $response) {

		$user = $this->auth->attempt(
			$request->getParam('username'),
			$request->getParam('password')
		);

		if (!$user) {

			$this->flash->addMessage('error', 'Wrong username or password!');

			return $response->withJson(['message' => 'auth failed'])->withRedirect($this->router->pathFor('login'));
		}

		$token = JWT::encode(['id' => $user->id, 'password' => $user->password], $this->container['settings']['jwt']['secret'], "HS256");

		$uri = $_SERVER['REQUEST_URI'];
		$uri_arr = explode('/', $uri);
		$path = end($uri_arr);
		
		if ($path == 'authenticate') {

			return $response->withJson(['token' => $token]);

		} else {
			
			return $response->withJson(['token' => $token])->withRedirect($this->router->pathFor('home'));
		}

	}

	public function postLogout($request, $response) {

		$this->auth->logout();

		return $response->withRedirect($this->router->pathFor('login'));
	}
}