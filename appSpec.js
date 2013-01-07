describe('Testing main controller', function() {
  var $scope, ctrl, topologicalSortMock, result;

  beforeEach(module('plunker'));
  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    
    // mock the topologicalSort service with a fake result
    result = "fake result";
    topologicalSortMock = jasmine.createSpy().andReturn(result);
    
    ctrl = $controller('MainCtrl', {
      $scope: $scope,
      topologicalSort: topologicalSortMock
    });
  }));

  it('should exist', function () {
    expect(!!ctrl).toBe(true);
	});
  
  describe("controller scope", function () {
    it('should attach elements as an empty array', function () {
      expect($scope.elements.length).toBe(0);
    });
    
    it('should attach form.select as null', function () {
      expect($scope.form.select).toBeNull();
    });
    
    it('should attach form.text as an empty string', function () {
      expect($scope.form.text).toBe("");
    });
  });
  
  describe("add", function () {
    var elementName;
    beforeEach(function () {
      $scope.form.text = elementName = "element added";
      $scope.add();
		});
    
    it('should add an element', function () {
      expect($scope.elements.length).toBe(1);
    });
    
    it('should add an element with the text as name', function () {
      expect($scope.elements[0].name).toBe(elementName);
    });
    
    it('should reset form.text as an empty string', function () {
      expect($scope.form.text).toBe("");
    });
  });
  
  describe("requiredChanged", function () {
    it('should invert the require value of the selected element to true', function () {
      $scope.form.select = {name:"an element", require:{A:false}};
      $scope.requiredChanged("A");
      expect($scope.form.select.require["A"]).toBeTruthy();
    });
    
    it('should invert the require value of the selected element to false', function () {
      $scope.form.select = {name:"an element", require:{A:true}};
      $scope.requiredChanged("A");
      expect($scope.form.select.require["A"]).toBeFalsy();
    });
  });
  
  describe("sort", function () {
    beforeEach(function () {
      var a = {name:"A thing", require:{}};
			var b = {name:"B", require:{}};
			b.require[a.name] = true;

      $scope.elements = [a, b];
      $scope.sort();
  	});
    
    it('should call the topologicalSort service with elements as parameter', function () {
      expect(topologicalSortMock).toHaveBeenCalledWith($scope.elements);
    });
    
    it('should attach the result of the sort', function () {
      expect($scope.result).toBe(result);
    });
  });
});