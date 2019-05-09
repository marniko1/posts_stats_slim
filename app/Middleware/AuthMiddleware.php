<?php

namespace App\Middleware;

class AuthMiddleware extends Middleware {

	public function __invoke($request, $response, $next) {

		$this->container->view->getEnvironment()->addGlobal('auth', [
			'check' => $this->container->auth->check(),
			'user' => $this->container->auth->user(),
		]);

		if (!$this->container->auth->check()) {
			
			return $response->withRedirect($this->container->router->pathFor('login'));
		}


		$response = $next($request, $response);
		return $response;
	}
}