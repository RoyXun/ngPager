/**
 * @author RoyXun
 * Adapted from brantwills's angular-Paging(https://github.com/brantwills/Angular-Paging)
 * 
 */

/**
 * @ngDoc directive
 * @name ng.directive:paging
 *
 * @description
 * A directive to aid in paging large datasets
 * while requiring a small amount of page
 * information.
 *
 * @element EA
 *
 */
angular.module('rx.pager', []).directive('rxPager', function () {

    /**
     * The angular return value required for the directive
     * Feel free to tweak / fork values for your application
     */
    return {

        // Restrict to elements and attributes
        restrict: 'EA',

        // Assign the angular link function
        link: fieldLink,
        
        // Assign the angular directive template HTML
        template: fieldTemplate,

        // Assign the angular scope attribute formatting
        scope: {
            page: '=',
            pageSize: '=',
            total: '=',
            pagingAction: '&',
            settings: '='
        }
                    
    };


    /**
     * Link the directive to enable our scope watch values
     *
     * @param {object} scope - Angular link scope
     * @param {object} el - Angular link element
     * @param {object} attrs - Angular link attribute
     */
    function fieldLink(scope, el, attrs) {
    	init(scope);
        // Hook in our watched items
        scope.$watchCollection('[page,pageSize,total]', function () {
            build(scope);
        });
    }
    
    
    /**
     * Create our template html 
     * We use a function to figure out how to handle href correctly
     * 
     * @param {object} el - Angular link element
     * @param {object} attrs - Angular link attribute
     */
    function fieldTemplate(el, attrs){
            return '<ul data-ng-hide="Hide" data-ng-class="options.ulClass"> ' +
                '<li ' +
                    'data-ng-class="Item.liClass" ' +
                    'data-ng-repeat="Item in List"> ' +
                        '<a href="javascript:void(0)"' + 
                            'data-ng-class="Item.aClass" ' +
                            'data-ng-click="Item.action()" ' +
                            'data-ng-bind="Item.value">'+ 
                        '</a> ' +
                '</li>' +
            '</ul>' 
    }


    function init(scope) {
    	var options = scope.options = angular.extend({}, {
	        'endPoint': 1, // 列表两端页码个数,仅支持1-3
	        'maxVisible': 5, //最多显示页码个数, 须满足maxVisible >= (3 + 2 * endPoint) && maxVisible <= 20
	        'showPrevNext': true,
	        'hideIfEmpty': true,
	        // text
	        'textDots': '...',
	        'textPrev': '上一页',
	        'textNext': '下一页',
	        // 一旦设置将覆盖text
	        'textDotsClass': '',
	        'textPrevClass': '',
	        'textNextClass': '',

	        'ulClass': 'pagination',
	        'dotsClass': 'dots', //省略号的表现样式可能稍有不同，所以可以通过自定义样式来修改
	        'disabledClass': 'disabled',
	        'activeClass': 'active'
      	}, scope.settings);

    	options.endPoint = parseInt(options.endPoint, 10) || 1;
      	options.maxVisible = parseInt(options.maxVisible, 10) || 5;

      	//页码列表两端页码数只能取[1, 2, 3]中的值
      	if (options.endPoint < 1) {
	        options.endPoint = 1;
      	} else if (options.endPoint > 3) {
	        options.endPoint = 3;
      	}

      	// maxVisible不小于 (2*endPoint + 3)，且不超过20(人为限制)
      	if (options.maxVisible < 2 * options.endPoint + 3) {
    		options.maxVisible = 2 * options.endPoint + 3;
  		} else if (options.maxVisible > 20) {
        	options.maxVisible = 20;
      	}	
    }

    /**
     * Validate and clean up any scope values
     * This happens after we have set the scope values
     *
     * @param {Object} scope - The local directive scope object
     */
    function validateScopeValues(scope) {
    	scope.List = [];

    	scope.page = parseInt(scope.page, 10) || 1;
    	scope.pageSize = parseInt(scope.pageSize, 10) || 10;
    	scope.total = parseInt(scope.total) || 0;

    	scope.Hide = scope.options.hideIfEmpty && scope.total == 0;

    	scope.totalPages = Math.ceil(scope.total / scope.pageSize) || 1;

        // Block where the page is larger than the pageCount
        if (scope.page > scope.totalPages) {
            scope.page = scope.totalPages;
        }

        // Block where the page is less than 0
        if (scope.page <= 0) {
            scope.page = 1;
        }
    }


    /**
     * Assign the method action to take when a page is clicked
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} page - The current page of interest
     */
    function internalAction(scope, page) {

        // Block clicks we try to load the active page
        if (scope.page == page) {
            return;
        }

        // Update the page in scope
        scope.page = page;

        // Pass our parameters to the paging action
        scope.pagingAction({
            page: scope.page,
            pageSize: scope.pageSize,
            total: scope.total
        });
    }


    /**
     * Add the first, previous, next, and last buttons if desired
     * The logic is defined by the mode of interest
     * This method will simply return if the scope.showPrevNext is false
     * This method will simply return if there are no pages to display
     *
     * @param {Object} scope - The local directive scope object
     * @param {string} mode - The mode of interest either prev or last
     */
    function addPrevNext(scope, mode) {
    	var options = scope.options;

        // Ignore if we are not showing
        // or there are not more than maxVisible pages to display
        if ((!options.showPrevNext) || scope.totalPages <= options.maxVisible) {
            return;
        }

        // Local variables to help determine logic
        var disabled;

        // Determine logic based on the mode of interest
        // Calculate the previous / next page and if the click actions are allowed
        if (mode === 'prev') {

            disabled = scope.page == 1;

            scope.List.push({
		        value: options.textPrevClass ? '' : options.textPrev,
		        liClass: disabled ? options.disabledClass: '',
		        aClass: options.textPrevClass,
		        action: function() {
		        	if (!disabled) {
		        		internalAction(scope, scope.page - 1);
		        	}
		        }
	      	});

        } else {

            disabled = scope.page == scope.totalPages;

            scope.List.push({
		        value: options.textNextClass ? '' : options.textNext,
		        liClass: disabled ? options.disabledClass: '',
		        aClass: options.textNextClass,
		        action: function() {
		        	if (!disabled) {
		        		internalAction(scope, scope.page + 1);
		        	}
		        }
	      	});
            
        }

      
    }


    /**
     * Adds a range of numbers to our list
     * The range is dependent on the start and finish parameters
     *
     * @param {int} start - The start of the range to add to the paging list
     * @param {int} finish - The end of the range to add to the paging list
     * @param {Object} scope - The local directive scope object
     */
    function addRange(start, finish, scope) {
        for (var i = start; i <= finish; i++) {
            scope.List.push({
              value: i,
              liClass: scope.page == i ? scope.options.activeClass : '',
              action: function() {
                internalAction(scope, this.value);
              }
            });
        }
    }


    /**
     * Add Dots ie: 1 2 [...] 10 11 12 [...] 56 57
     *
     * @param {Object} scope - The local directive scope object
     */
    function addDots(scope) {
        var options = scope.options;
        scope.List.push({
	        value: options.textDotsClass ? '' : options.textDots,
	        liClass: options.dotsClass,
	        aClass: options.textDotsClass
	      });
    }


    /**
     * Add the first or beginning items in our paging list
     * We leverage the 'next' parameter to determine if the dots are required
     *
     * @param {Object} scope - The local directive scope object
     * @param {int} next - the next page number in the paging sequence
     */
    function addFirst(scope, next) {

        addRange(1, scope.options.endPoint, scope);
        // We ignore dots if the next value is 3
        // ie: 1 2 [...] 3 4 5 becomes just 1 2 3 4 5
        if (next != scope.options.endPoint + 1) {
          addDots(scope);
      	}
    }


    /**
     * Add the last or end items in our paging list
     * We leverage the 'prev' parameter to determine if the dots are required
     *
     * @param {int} pageCount - The last page number or total page count
     * @param {Object} scope - The local directive scope object
     * @param {int} prev - the previous page number in the paging sequence
     */
    // Add Last Pages
    function addLast(scope, prev) {

        // We ignore dots if the previous value is one less that our start range
        // ie: 1 2 3 4 [...] 5 6  becomes just 1 2 3 4 5 6
       	if (prev != scope.totalPages - scope.options.endPoint) {
        	addDots(scope);
      	}

      	addRange(scope.totalPages - scope.options.endPoint + 1, scope.totalPages, scope);
    }



    /**
     * The main build function used to determine the paging logic
     * Feel free to tweak / fork values for your application
     *
     * @param {Object} scope - The local directive scope object
     */
    function build(scope) {
        validateScopeValues(scope);

        var start, finish;
        var totalPages = scope.totalPages,
        	page = scope.page,
        	maxVisible = scope.options.maxVisible,
        	endPoint,
        	pad,
        	adjacent;

        // Add the Next and Previous buttons to our list
        addPrevNext(scope, 'prev');

     	// If the page count is less than the maxVisible size
        // Then we simply display all the pages, Otherwise we calculate the proper paging display
      	if (totalPages <= maxVisible) {
        	addRange(1, totalPages, scope);
      	} else {
      		endPoint = scope.options.endPoint;
            pad = (maxVisible - 1) % 2, //用于修正maxVisible为偶数时当前页右侧相邻页数
            adjacent = (maxVisible - pad - 2 * endPoint - 1) / 2;

	        // Determine if we are showing the beginning of the paging list
	        if (page <= endPoint + adjacent + 1) {
	          start = 1;
	          end = endPoint + adjacent * 2 + 1 + pad;
	          addRange(start, end, scope);
	          addLast(scope, end);
	        }
	       // Determine if we are showing the end of the paging list
	        else if (page >= totalPages - endPoint - adjacent - pad) {
	          start = totalPages - 2 * adjacent - pad - endPoint;
	          end = totalPages;
	          addFirst(scope, start);
	          addRange(start, end, scope);
	        }
	        // If nothing else we conclude we are at the middle of the paging list
	        else {
	          start = page - adjacent;
	          end = page + adjacent + pad;
	          addFirst(scope, start);
	          addRange(start, end, scope);
	          addLast(scope, end);
	        }
      	}

        // Add the next and last buttons to our paging list
        addPrevNext(scope, 'next');
    }

});
