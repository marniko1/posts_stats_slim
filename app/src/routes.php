<?php

use Slim\App;
use App\Middleware\AuthMiddleware;

return function (App $app, $container) {

	$app->group('', function () {

		$this->get('/', 'HomeController:index')->setName('home');

		$this->post('/logout', 'LoginController:postLogout')->setName('logout');

	})->add(new AuthMiddleware($container));

	$app->post('/authenticate', 'LoginController:postLogin');

	$app->group('/api', function () {
		var_dump($_SERVER); die;
		$this->post('/options', 'ApiController:setOptions');
	});

	$app->post('/ajax', 'AjaxController:index');

	$app->group('/login', function () use ($container) {
		$this->get('', 'LoginController:getLogin')->setName('login')->add(new \App\Middleware\CsrfViewMiddleware($container));
		$this->post('', 'LoginController:postLogin');
	})->add($container->csrf);
};
