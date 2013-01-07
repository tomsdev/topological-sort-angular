describe('Testing topologicalSort service', function() {
  var topologicalSort;
  
  beforeEach(module('plunker'));
  
	beforeEach(inject(function(_topologicalSort_) {
		topologicalSort = _topologicalSort_;
	}));

	it('should exist', function () {
		expect(!!topologicalSort).toBe(true);
	});
  
  describe("result of a possible topological sort", function () {
    var elements, result;

		beforeEach(function () {
			var a = {name:"A thing", require:{}};
			var b = {name:"B", require:{}};
			var c = {name:"C", require:{}};
			var d = {name:"D", require:{}};
			var e = {name:"E", require:{}};
			var f = {name:"F", require:{}};

			b.require[a.name] = true;
			c.require[b.name] = true;
			d.require[b.name] = true;
			d.require[f.name] = true;
			e.require[d.name] = true;

			elements = [a, b, c, d, e, f];

			result = topologicalSort(elements);
		});

		it("should have a vertices hash table with the 6 vertices", function () {
			angular.forEach(["A thing", "B", "C", "F", "D", "E"], function(v) {
				expect(result.vertices[v]).toBeDefined();
			});
		});

		it("should have the correct adjacent list for each vertice", function () {
		  expect(result.vertices["A thing"].adj).toContain("B");
  		expect(result.vertices["B"].adj).toContain("C");
			expect(result.vertices["B"].adj).toContain("D");
			expect(result.vertices["D"].adj).toContain("E");
			expect(result.vertices["F"].adj).toContain("D");
			expect(result.vertices["C"].adj.length).toBe(0);
			expect(result.vertices["E"].adj.length).toBe(0);
		});

		it("should contains the 6 elements in order array", function () {
			angular.forEach(["A thing", "B", "C", "F", "D", "E"], function(v) {
				expect(result.order).toContain(v);
			});
		});

		it("should have a correct order of elements", function () {
			expect(result.order.indexOf("A thing")).toBeLessThan(result.order.indexOf("B"));
			expect(result.order.indexOf("B")).toBeLessThan(result.order.indexOf("C"));
			expect(result.order.indexOf("B")).toBeLessThan(result.order.indexOf("D"));
			expect(result.order.indexOf("F")).toBeLessThan(result.order.indexOf("D"));
			expect(result.order.indexOf("D")).toBeLessThan(result.order.indexOf("E"));
		});
	});

	describe("result of an impossible topological sort", function () {
		var elements, result;

		beforeEach(function () {
			var a = {name:"A thing", require:{}};
			var b = {name:"B", require:{}};
			var c = {name:"C", require:{}};
			var d = {name:"D", require:{}};
			var e = {name:"E", require:{}};
			var f = {name:"F", require:{}};

			b.require[a.name] = true;
			c.require[b.name] = true;
			d.require[b.name] = true;
			d.require[f.name] = true;
			e.require[d.name] = true;
			a.require[d.name] = true; // cycle created

			elements = [a, b, c, d, e, f];

			result = topologicalSort(elements);
		});

		it("should have an error", function () {
				expect(result.error.length).toBeGreaterThan(0);
		});
	});
});