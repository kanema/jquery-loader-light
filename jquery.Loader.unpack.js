/*!
 * jQuery Plugin loader Light alpha
 * http://kanema.com.br/
 *
 * Date: 00:11 quinta-feira, 18 de novembro de 2010
 */

; (function($) {

	$.loader = function ( options )
	{
		if ( options === undefined || options.constructor !== Object ) {
			return this;
		};
		
		if ( options.name ) {
			if ( options.name.constructor === String ) {
				$.loader._proxy( options );
			} else {
				var	name = options.name,
					i = name.length - 1;
				while ( i >= 0 ) {
					options.name = name[i];
					$.loader._proxy( options );
					i--;
				};
			};
			return true;
		};
		
		return $.loader._load(options);
	};

	$.extend(
		$.loader, {
			/**
			 * @access public
			 */
			base: '',

			/**
			 * @access private
			 */
			_call: [],
			_past: [],
			_count:{ 'i':0, 'o':0 },

			/**
			 * Functions
			 */
			_proxy : function( options ) {
				var obj = {},
					prepend = [],
					setFunction = function setFunction() {
						var that = this,
							args = arguments;
						
						return $.loader._load.apply(that, [{
							'url': options.url,
							'success': options.success,
							'callback': function() {
								return prepend[options.name].apply(that, args);
							}
						}]);
					};

				if ( (options.name).indexOf("$.fn") === 0 ) {
					options.name = options.name.replace(/\$.fn./, '');
					prepend = $.fn;
				} else if ( (options.name).indexOf("$") === 0 ) {
					options.name = options.name.replace(/\$./, '');
					prepend = $;
				} else {
					if (/\./.test(options.name)) {
						return false;
					};
					prepend = window;
				};
				obj[options.name] = obj[options.name] || setFunction;
				$.extend(prepend, obj);
				return true;
			},
			
			_sliceArray : function( options ) {
				options.count = 1;
				
				if ( $.isFunction( options.success ) ) {
					$.loader._call.push( options.success );
					options.success = null;
				};
				
				$.loader._count.i += options.url.length;
				
				var	url = options.url,
					i = url.length - 1;
				while ( i >= 0 ) {
					options.url = url[i];
					$.loader._load(options);
					i--;
				};
				
				options.url = null;
				$.loader._proxy( options );
				return true;
			},

			_load : function(options) {
				if ( options.url.constructor === Array ) {
					$.loader._sliceArray( options );
				};
				
				if ( $.inArray(options.url, $.loader._past) === -1 ) {
					$.loader._past.push( options.url );
					$.ajax({
						dataType: 'script',
						type : 'GET',
						async : false,
						cache: true,
						url: ( ( options.url.indexOf('http') ) ? '' : $.loader.base ) + options.url,
					}).responseText;

					if ( options.success !== undefined && $.isFunction( options.success ) ) {
						$.loader._call.push( options.success );
					};
					$.loader._callback();
					if ( options.callback !== undefined && $.isFunction( options.callback ) ) {
						return options.callback();
					};
					return true;
				} else {
					if ( $.isFunction(options.callback) )
						return options.callback();
					return false;
				};

			},
			
			_callback : function ( obj ) {
				$.loader._count.o += ( obj ) ? obj.count : 1;
				if ($.loader._count.o == $.loader._count.i) {
					while( $.loader._call.length ) {
						( $.loader._call.shift() ).success();
					};
				}
			}
			
		}
	);

})(jQuery);