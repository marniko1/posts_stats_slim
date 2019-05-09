<?php

namespace App\Controllers;

class AjaxController extends Controller {

	public $method;
	public $host;
	
	public function __construct () {
		$this->method = $_POST['ajax_fn'];
		$this->host = $_POST['host'];
	}
	public function index () {
		$method = $this->method;
		$this->$method();
	}

	public function hashKeyMaker () {
		
		echo md5(sha1(md5($this->host)));
	}
}