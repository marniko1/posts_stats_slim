<?php

use Slim\App;

return function (App $app, $container) {


    // Illuminate/database register
	$capsule = new \Illuminate\Database\Capsule\Manager;

	$capsule->addConnection($container['settings']['db']);

	$capsule->setAsGlobal();

	$capsule->bootEloquent();

	$container['db'] = function ($container) use ($capsule) {
	    return $capsule;
	};

	// Registering Twig view lib
	$container['view'] = function ($container) {
		$view = new \Slim\Views\Twig(__DIR__ . '/../../resources/views', [
			'cache' => false,
		]);

		$view->addExtension(new \Slim\Views\TwigExtension(
			$container->router,
			$container->request->getUri()
		));

		return $view;
	};

	// Flash Msgs register
	$container['flash'] = function ($container) {
		return new \Slim\Flash\Messages;
	};

	//Register the CSRF Component
	$container['csrf'] = function ($container) {
		return new \Slim\Csrf\Guard;
	};

	// Auth register
	$container['auth'] = function ($container) {
		return new \App\Auth\Auth;
	};

	// registering App Controllers
	$container['HomeController'] = function ($container) {
		return new \App\Controllers\HomeController($container);
	};

	$container['LoginController'] = function ($container) {
		return new \App\Controllers\LoginController($container);
	};

	$container['ApiController'] = function ($container) {
		return new \App\Controllers\ApiController($container);
	};

	$container['AjaxController'] = function ($container) {
		return new \App\Controllers\AjaxController($container);
	};
};