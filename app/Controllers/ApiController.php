<?php

namespace App\Controllers;

class ApiController extends Controller {

	public function setOptions($request, $response) {

		$data = $request->getParsedBody();

		if ($data === null) {
	        return $response->withJson(
	            ['error_decoding_json' => json_last_error_msg()],
	            400,
	            JSON_PRETTY_PRINT
	        );
	    }

		if (!empty($data) && isset($data['json_data']) && $this->data_ok($data['json_data'])) {

				$file = __DIR__ . '/../../public/options/options.json';

				$options_json = json_decode(file_get_contents($file));


				if ($options_json === null) {
					$options_json = array();
				}


				$data['json_data']['URL'] = $data['url'];

				$key = $this->is_registered($options_json, $data['json_data']);

				if ($key === false) {

					array_push($options_json, $data['json_data']);

				} else {

					$options_json[$key] = $data['json_data'];
				}

				file_put_contents($file, json_encode($options_json, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT));

				return $response->withJson(array('message' => 'success'));
				
		} else {


			return $response->withJson(array('message' => 'Wrong type of request'));
		}
	}

	// method to check is wp site already registered
	public function is_registered($options_json, $json_data) {

		foreach ($options_json as $key => $value) {

			if ($value->URL == $json_data['URL']) {

				return $key;
			}
		}

		return false;
	}

	// checking data form
	public function data_ok($json_data) {

		$property_names = array('Name', 'URL', 'cats');

		foreach ($property_names as $name) {
			
			if (!array_key_exists($name, $json_data)) {
				
				return false;
			}
		}

		return true;
	}
}