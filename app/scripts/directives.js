zed2app.directive('ngUppercaseInput', function () {
	return {

		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			var capitalize = function ($viewValue) {
				if ($viewValue) {
					var capitalized = $viewValue.toUpperCase();
					if (capitalized !== $viewValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
					return capitalized;
				}

			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
})

.directive('ngUppercaseInput2', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var capitalize = function($viewValue) {
				var initCursor = element[0].selectionStart;
				if ($viewValue) {
					var capitalized = $viewValue.toUpperCase();
					if (capitalized !== $viewValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
					element[0].selectionStart = element[0].selectionEnd = initCursor;
					return capitalized;
				}

			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
})
