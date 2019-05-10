<?php

return [
	'settings' => [
		'displayErrorDetails' => true,
		'db' => [
			'driver'    => 'mysql',
	        'host'      => 'localhost',
	        'database'  => 'wp_app',
	        'username'  => 'root',
	        'password'  => '',
	        'charset'   => 'utf8',
	        'collation' => 'utf8_unicode_ci',
	        'prefix'    => '',
		],
		// jwt settings
        "jwt" => [
            'secret' => 'supersecretkeyyoushouldnotcommittogithub'
        ],
	],
];