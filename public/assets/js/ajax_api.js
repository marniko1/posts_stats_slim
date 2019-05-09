jQuery(document).ready(function() {
	$('.main_form').submit(function(e){
		e.preventDefault();
		// cheks bootstrap builtin form validation
		if ($('.main_form')[0].checkValidity() === false) {
	        e.stopPropagation();
	    } else {
			var params = $(this).serializeArray();

			var url = params[0]['value'];
			
			
			var data = make_data_string(params);



			// first ajax requesting hash_key
			$.ajax( {
		      	type: "POST",
		      	url: root_url + "ajax",
		      	data: 'ajax_fn=hashKeyMaker&host=' + url,

		      	success: function( response ) {


		        	var hash_key = response;
		        	params.push({name: "hash_key", value: hash_key});

					var data = make_data_string(params);


					// second ajax requesting data from site
	        		$.ajax( {
				      	type: "GET",
				      	url: url,
				      	dataType: 'json',
				      	data: data,

				      	success: function( response ) {

				        	show_response_data(response);
				        	// DIALOG WIDGET jquery_ui
				        	$("td a").on('click', function(e){
				        		e.preventDefault();

				        		var category = $(this).data('category');
				        		var year = $(this).data('year');
				        		var month = $(this).data('month');
				        		var titles_str = $(this).data('titles');
				        		var urls_str = $(this).data('urls');

				        		var dialog_box_html = `<h4>${category} ${month} ${year}</h4>
				        		<ul>`;


				        		var titles_arr = titles_str.split("----");
				        		var urls_arr = urls_str.split("----");

				        		$.each(titles_arr, function(key, title){

				        			dialog_box_html += `<li><a href="${urls_arr[key]}">${title}</a></li>`;
				        		});

				        		dialog_box_html += '</ul>'


				        		$( '.dialog' ).dialog(

				        				{
				        					width: 500, 
				        					maxHeight: 400,
				        					closeOnEscape: true
				        				}
				        			);
				        		$('div.dialog').html(dialog_box_html)
				        	})
				        	// end of DIALOG WIDGET
				      	},
				      	error: function(XMLHttpRequest, textStatus, errorThrown) {
					     	console.log("wp api error"+errorThrown);
					 	}
				    });






		      	},
		      	error: function(XMLHttpRequest, textStatus, errorThrown) {
			     	console.log("hash key maker error"+errorThrown);
			 	}
		    });



			
		}
    	$('.main_form').addClass('was-validated');
	});

	function make_data_string(params) {
		var data = 'callback=cps_get_posts_stats&';
		var cats = 'cats=';
		$.each(params, function(key, param){
			if (key != 0) {
				if (param.name == 'category') {
					cats += "'" + param.value + "',";
				} else {
					data += param.name + '=' + param.value + '&'
				}
			}
		});
		cats = cats.slice(0, -1);
		data += cats;
		return data;
	}

	function show_response_data (response) {
		var primary_html = make_primary_table(response);
		$('.primary-table-wrapper').html(primary_html);
		var secondary_html = make_secondary_table(response);
		secondary_html = sanitize_secondary_table(secondary_html);
		$('.secondary-table-wrapper').html(secondary_html);
	}

	function make_primary_table(response_arr) {
		var html = '<div class="col-12 border border-info rounded">';
		if (response_arr.length != 0) {
			html += `<div class="mb-5 mt-2"> 
						<a  onClick="excelDownload(this)" class="btn btn-success position-relative primary-excel-download"><span class="mr-4">Download Excel</span></a>
					</div>`;
		}
		html += `<div class="col-12 border rounded py-2 my-3">
						<div class="table-wrapper higher-table-wrapper col-12 border-top border-bottom p-0">
							<table class="primary-stat-table col-12" border="2">
								<thead>
								    <tr>
								      <th scope="col">Date</th>
								      <th scope="col">Category</th>
								      <th scope="col">Title</th>
								      <th scope="col">Slug</th>
								    </tr>
							  	</thead>
							  	<tbody>`;
		$.each($(response_arr), function(key, response){
			var titles_arr = response.post_title.split("----");
			var urls_arr = response.post_url.split("----");
			var names_arr = response.post_name.split("----");
			$.each(titles_arr, function(k,v){
				// adding ZERO WIDTH SPACE character &#8203; to force date field export to excel as string
				html += `<tr class="full-year full-month">
					      	<td nowrap>&#8203;${response.full_date}</td>
					      	<td>${response.term_slug}</td>
					      	<td align="center"><a href="${urls_arr[k]}">${v}</a></td>
					      	<td align="right">/${names_arr[k]}/</td>
					    </tr>`;
			});
		});
		if (response_arr.length == 0) {
			html += '<tr><td colspan="5" class="text-danger">No data.</td></tr>'
		}
		html += `</tbody>
				</table>
				</div>
				</div>
				</div>`;
		return html;
	}

	function make_secondary_table(response_arr) {
		var html = '<div class="col-12 border border-info rounded">';
		if (response_arr.length != 0) {
			html += `<div class="mb-5 mt-2"> 
						<a  onClick="excelDownload(this)" class="btn btn-success position-relative secondary-excel-download"><span class="mr-4">Download Excel</span></a>
					</div>`;
		}
		html += `<div class="col-12 border rounded py-2 my-3">
						<div class="table-wrapper lower-table-wrapper col-12 border-top border-bottom p-0">
							<table class="secondary-stat-table col-12" border="2">
								<thead>
								    <tr>
								      <th scope="col">#</th>
								      <th scope="col">Year</th>
								      <th scope="col">Month</th>
								      <th scope="col">Category</th>
								      <th scope="col">Number</th>
								    </tr>
							  	</thead>
							  	<tbody>`;
		$.each($(response_arr), function(key, response){
			html += `<tr class="full-year full-month">
						<th scope="row">${key + 1}</th>
				      	<td class="year"><b>${response.post_year}</b></td>
				      	<td class="month">${response.post_month}</td>
				      	<td>${response.term_slug}</td>
				      	<td align="right"><a href="#" data-year="${response.post_year}" data-month="${response.post_month}" data-category="${response.term_slug}" data-titles="${response.post_title}" data-urls="${response.post_url}">${response.num}</a></td>
				    </tr>`;
		});
		if (response_arr.length == 0) {
			html += '<tr><td colspan="5" class="text-danger">No data.</td></tr>'
		}
		html += `</tbody>
				</table>
				</div>
				</div>
				</div>`;
		return html;
	}

	function sanitize_secondary_table(html) {
		var html = $(html);
		var t_rows = $(html).find('tr');
		$.each(t_rows, function(key, tr) {
			if (key != 0) {
				var tds = $(tr).find('td');
				$.each(tds, function(k, td){
					if (k == 0 || k == 1) {

						if (k==0) {
							var td_before = $(this).parent().prevAll("tr.full-year:first").find('td.year');
						} else {
							var td_before = $(this).parent().prevAll("tr.full-month:first").find('td.month');
						}

						if ($(td).text() == $(td_before).text()) {
							var rowspan_attr = $(td_before).attr('rowspan');
							if (!rowspan_attr) {
								rowspan_attr = 1;
							}
							$(td_before).attr('rowspan', parseInt(rowspan_attr) + 1);
							if (k==0) {
								$(this).parent().removeClass('full-year');
							} else {
								$(this).parent().removeClass('full-month');
							}
							$(this).remove();
						}
					}
				});
			}
		});
		return html;
	}
});