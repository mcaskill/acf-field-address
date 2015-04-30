(function($){

	var widgetCount = 0;

	// factory function for creating widget closures
	var makeLayout = function(options, $el) {

		// keeping track of multiple widgets
		widgetCount = widgetCount + 1;

		// Widget Defaults
		var defaults = {
			layout: [
				[{ id: 'street1', label: 'Street 1' }],
				[{ id: 'street2', label: 'Street 2' }],
				[{ id: 'street3', label: 'Street 3' }],
				[
					{ id: 'city', label: 'City' },
					{ id: 'state', label: 'State' },
					{ id: 'zip', label: 'Postal Code' },
					{ id: 'country', label: 'Country' }
				],
				[]
			],
			rowClass: 'acf-address-' + widgetCount + '-row acf-address-row',
			sortableElement: 'li'
		};

		// merge defaults and passed arguments
		var settings = $.extend( defaults, options );


		// closure scope so its absolutely clear
		var closure = {
			$el: $el,
			layout: settings.layout,
			rowClass: settings.rowClass,
			sortableElement: settings.sortableElement,
			$inputElement: $('<input type="hidden">')
				.prop('name', 'acfAddressWidget[' + settings.fieldKey + '][address_layout]')
				.prop('value', JSON.stringify(settings.layout)),
			$detachedEls: {}
		};


		var setGridPositions = function() {

			var positions = [];

			closure.$el.find('.'+closure.rowClass).each(function(rowIndex, row) {

				var r = [];

				$(row).find(closure.sortableElement).each(function(col, item) {

					var $item = $(item);

					r[col] = {
						id: $item.data().id,
						label: $item.data().label
					};

					// create a position object that holds the row and column values
					var position = {
						col: col,
						row: rowIndex
					};

					// set the data properties col and row to the corresponding values
					$item.data(position);

				});

				positions[rowIndex] = r;

			});

			closure.$inputElement.attr('value', JSON.stringify(positions));

		};

		var makeSortable = function($el, options) {

			var settings = $.extend({
				stop: function () { // takes parameters event, ui
					setGridPositions();
				},
				placeholder: 'sortable-placeholder',
				forcePlaceholderSize: true
			}, options);

			return $el.sortable(settings).disableSelection();

		};


		var setSortableLabel = function(e) {
			var id = e.data.id,
				label = e.target.value;

			if($(e.target).data('col') === 'label') {
				closure.$el.find('li').each(function(index, element) {
					$el = $(element);
					if( $el.data().id === id ) {
						$el.data('label', label)
							.text(label);
					}
				});
			}
		};


		var toggleSortable = function(e) {

			var id = e.data.id,
				targetData = $(e.target).data(),
				$lastUl = closure.$el.find('.'+closure.rowClass).last();

			if(e.target.checked) {

				// check to see if its in the $detachedEls object
				if ( closure.$detachedEls.hasOwnProperty(id) ) {
					// used the saved one
					$lastUl.append(closure.$detachedEls[id]);
				} else {
					// create the element from scratch
					$lastUl.append( $('<li></li>')
						.data({
							id: targetData.id,
							label: targetData.label
						})
						.text(targetData.label) );
				}

			} else {

				closure.$el.find('li').each(function(index, element) {
					$el = $(element);
					if( $el.data().id === id ) {
						closure.$detachedEls[id] = $el;
						$el.detach();
					}
				});

			}

			// update the layout input with changes
			setGridPositions();

		};

		var buildLayout = function() {

			closure.$el.append(closure.$inputElement);

			$(closure.layout).each(function(row, items) {
				var $ul = $('<ul></ul>').addClass(closure.rowClass);
				closure.$el.append($ul);

				makeSortable($ul, {connectWith: "." + closure.rowClass});

				$(items).each(function(col, obj) {
					$ul.append( $('<li></li>')
						.addClass('acf-address-item')
						.data( obj )
						.html( '<span class="item-title">' + obj.label + '</span>' ) );
				});

			});

		};

		buildLayout();

		// we need to return some functions
		return {
			onBlur: setSortableLabel,
			onCheck: toggleSortable
		};

	};

	var makeOptions = function(options, $el) {

		// Widget Defaults
		var defaults = {
			options: {
				street1 : { id: 'street1', label: 'Street 1',    defaultValue: '', placeholder: '', enabled: true, width: '', className: 'street1', separator: ''  },
				street2 : { id: 'street2', label: 'Street 2',    defaultValue: '', placeholder: '', enabled: true, width: '', className: 'street2', separator: ''  },
				street3 : { id: 'street3', label: 'Street 3',    defaultValue: '', placeholder: '', enabled: true, width: '', className: 'street3', separator: ''  },
				city    : { id: 'city',    label: 'City',        defaultValue: '', placeholder: '', enabled: true, width: '', className: 'city',    separator: ',' },
				state   : { id: 'state',   label: 'State',       defaultValue: '', placeholder: '', enabled: true, width: '', className: 'state',   separator: ''  },
				zip     : { id: 'zip',     label: 'Postal Code', defaultValue: '', placeholder: '', enabled: true, width: '', className: 'zip',     separator: ''  },
				country : { id: 'country', label: 'Country',     defaultValue: '', placeholder: '', enabled: true, width: '', className: 'country', separator: ''  }
			}
		};

		// merge defaults and passed arguments
		var settings = $.extend( defaults, options );

		// Add some functionality to the event methods
		function onBlurWithAfter(e) {
			settings.onBlur(e);
			afterOnEvent(e);
		}
		function onCheckWithAfter(e) {
			settings.onCheck(e);
			afterOnEvent(e);
		}

		// closure scope so its absolutely clear
		var self = {
			$element: $el,
			$inputElement: $('<input type="hidden">')
				.data('val', settings.options)
				.prop('value', JSON.stringify(settings.options))
				.prop('name', 'acfAddressWidget[' + settings.fieldKey + '][address_options]'),
			options: settings.options,
			onBlur: onBlurWithAfter,
			onCheck: onCheckWithAfter
		};

		function afterOnEvent(e) {

			var data = self.$inputElement.data();

			var col = $(e.target).data('col');

			if(e.type === 'change') {
				data.val[e.data.id][col] = e.target.checked;
			} else {
				data.val[e.data.id][col] = e.target.value;
			}

			self.$inputElement.data(data);

			self.$inputElement.prop('value', JSON.stringify(data.val));
		}

		var makeInput = function ( type, value, data ) {
			var $input = $('<input type="hidden">')
				.val(value)
				.data(data);

			if( type === 'checkbox' ) {
				$input.prop('type', 'checkbox')
					.prop('checked', value)
					.on('change', data, self.onCheck);
			}
			if( type === 'text' ) {
				$input.prop('type', 'text')
					.on('blur', data, self.onBlur);
			}

			return $input;
		};

		var init = function() {

			self.$element.append(self.$inputElement);

			var $table = $('<table></table>');
			var $head = $('<tr></tr>')
				.append( $('<th>Enabled</th>') )
				.append( $('<th>Label</th>') )
				.append( $('<th>Default Value</th>') )
				.append( $('<th>Placeholder</th>') )
				.append( $('<th>Width</th>') )
				.append( $('<th>CSS Class</th>') )
				.append( $('<th width="10%">Separator</th>') );

			$table.append($head);

			$.each(self.options, function(row, obj) {

				var $tr = $('<tr></tr>');

				var $tdEnabled     = $('<td></td>').append(makeInput('checkbox', obj.enabled, obj).data('col', 'enabled'));
				var $tdLabel       = $('<td></td>').append(makeInput('text', obj.label, obj).data('col', 'label'));
				var $tdDefault     = $('<td></td>').append(makeInput('text', obj.defaultValue, obj).data('col', 'defaultValue'));
				var $tdPlaceholder = $('<td></td>').append(makeInput('text', obj.placeholder, obj).data('col', 'placeholder'));
				var $tdWidth       = $('<td></td>').append(makeInput('text', obj.width, obj).data('col', 'width'));
				var $tdClassName   = $('<td></td>').append(makeInput('text', obj.className, obj).data('col', 'className'));
				var $tdSeparator   = $('<td></td>').append(makeInput('text', obj.separator, obj).data('col', 'separator'));

				$tr.append($tdEnabled)
					.append($tdLabel)
					.append($tdDefault)
					.append($tdPlaceholder)
					.append($tdWidth)
					.append($tdClassName)
					.append($tdSeparator);

				$table.append($tr);
			});

			self.$element.append($table);

		};

		init();

		// in this case we will just return the jQuery object
		return self.$element;

	};

	$.fn.acfAddressWidget = function( options ) {

		var $this = $(this);

		var settings = $.extend( {}, options );

		// Call our instance closure
		// to handle multiple elements
		$this.each(function(index, element) {

			var $element = $(element);

			if( $element.data('acfAddressWidgetized') === true ) {
				return;
			}

			$element.data('acfAddressWidgetized', true);

			var $optionsContainer = $('<div></div>').attr('id', 'options-container').addClass('acf-hl acf-fc-meta');
			var $layoutContainer = $('<div></div>').attr('id', 'layout-container').addClass('acf-address-layout');

			var $wrap = $('<div class="acf-field-list-wrap"></div>');
			var $foot = $('<ul class="acf-hl acf-tfoot"><li class="comic-sans"><i class="acf-sprite-arrow"></i>' + 'Drag and drop to reorder' /* <?php _e('Drag and drop to reorder','acf'); ?> */ + '</li></ul>');

			$element.append( $optionsContainer ).append( $wrap );
			$wrap.append( $layoutContainer ).append( $foot );

			settings.fieldKey = $element.data('field');

			settings.layout = window.acfAddressWidgetData.address_layout;

			settings.options = window.acfAddressWidgetData.address_options;

			var lc = makeLayout( settings, $layoutContainer );

			settings.onBlur = lc.onBlur;
			settings.onCheck = lc.onCheck;
			makeOptions( settings, $optionsContainer );
		});

		return $this;

	};

})(jQuery);
