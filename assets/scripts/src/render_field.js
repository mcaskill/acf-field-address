jQuery(document).ready(function ($) {

	var $addressWidget = $('.acf-address-field');

	$addressWidget.each(function (index, element) {

		var $el     = $(element)
		,   name    = $el.data('name')
		,   value   = $el.data('value')
		//  output  = $el.data('output-type')
		,   layout  = $el.data('layout')
		,   options = $el.data('options');

		value = $.extend({
			street1 : null,
			street2 : null,
			street3 : null,
			city    : null,
			state   : null,
			zip     : null,
			country : null
		}, value);

		$.each(layout, function (rowIndex, row) {

			// loop through layout and render the input fields
			if ( row.length ) {

				var $ul = $('<ul/>');

				$.each(row, function(col, obj) {

					var $li = $('<li/>')
					  , $label = $('<label/>')
					  , $input = $('<input/>')
					  ;

					var propName = name + '[' + obj.id + ']';

					$label
						.prop( 'for', propName )
						.text( options[obj.id].label )

					$input
						.prop('type', 'text')
						.prop('name', propName)
						.prop('value', (value[obj.id] || options[obj.id].defaultValue));

					if ( options[obj.id].width ) {
						$input.css('width', options[obj.id].width + '%');
					}

					if ( options[obj.id].classname ) {
						$input.addClass( options[obj.id].classname );
					}

					if ( options[obj.id].placeholder ) {
						$input.css('placeholder', options[obj.id].placeholder );
					}

					$li.append( $label ).append( $input );

					$ul.append( $li );

				});

				$el.append( $ul );

			}
		});

	});

});
