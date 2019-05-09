jQuery(document).ready(function(){

	var options_json = root_url + "options/options.json";
	var options_html = '<option value="">Choose site...</option>';

	$.getJSON(options_json, function(data){
		$.each(data, function(key, value){
			options_html += `<option value="${value.Name}">${value.Name}</option>`;
		});
		$('#site-select').html(options_html);
	});
	$('#site-select').on('change', function(){
		$('#site-select').parent().find('input').remove();
		var html = '';
		var select_val = $(this).val();
		$.getJSON(options_json, function(data){
			$.each(data, function(key, value){
				if (value.Name == select_val) {
					var cats = sortObj(value.cats);
					$('#site-select').before(`<input type="hidden" name="picked_site_name" value="${value.URL}">`);
					$.each(cats, function(k, v){
						html += `<option value="${k}">${v}</option>`;
					});
				}
			});
			$('select#categories').html(html);
			$('select#categories').attr('disabled', false);
			$('label#categories-label').removeClass('text-muted');
		});
	});

	function sortObj(obj) {
		var sorted_obj = {};
		Object.keys(obj).sort().forEach(function(key) {
		  sorted_obj[key] = obj[key];
		});
		return sorted_obj;
	}
});