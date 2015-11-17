

var app = angular.module('myApp', ['ui.bootstrap', 'ngRoute']);



    // configure our routes
    app.config(function($routeProvider) {
        $routeProvider
        
            // route for the home page
            .when('/', {
                templateUrl : 'home.html',
                controller  : 'colors'
            })
        

            // route for patterns page
            .when('/patterns/:hex', {
                templateUrl : 'patterns.html',
                controller  : 'patterns'
            })
    });



//Main Controller

	app.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Test!';
	});



app.controller('colors', function colors($scope, $http, $modal) {
    $http.jsonp("http://www.colourlovers.com/api/colors/top?format=json&jsonCallback=JSON_CALLBACK")
        .success(function (data) {
        $scope.items = data
    });
    
    
    
      $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        },
        item: function(){
          return size;
        }
      }
    });

  };
  
  
    
});


//pattern controller

    app.controller('patterns', function($scope, $routeParams, $http, $modal) {
        //$scope.message = "The hex value is " + $routeParams.hex;
        
        //Make the API call
        
        $http.jsonp("http://www.colourlovers.com/api/patterns?hex=" + $routeParams.hex + "&format=json&jsonCallback=JSON_CALLBACK")
        .success(function (data) {
        $scope.items = data
    });
        
        
              $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        },
        item: function(){
          return size;
        }
      }
    });

  };
        
        
        
    });

angular.module('myApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, item) {
  
  console.log(item);
  $scope.item = item;
  
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('myApp').directive("masonry", function () {
   var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);
            
            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));
                
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                    
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });
                    
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                
                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
});

