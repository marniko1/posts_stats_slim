<?php

session_start();

require __DIR__ . '/../vendor/autoload.php';

// Instantiate the app
$settings = require __DIR__ . '/../app/src/settings.php';
$app = new \Slim\App($settings);

$container = $app->getContainer();

// Set up dependencies
$dependencies = require __DIR__ . '/../app/src/dependencies.php';
$dependencies($app, $container);

// Register middleware
$middleware = require __DIR__ . '/../app/src/middleware.php';
$middleware($app, $container);

// Register routes
$routes = require __DIR__ . '/../app/src/routes.php';
$routes($app, $container);