app.factory('topologicalSort', function() {
  var vertices, order, error;

  /**
   * Take an array of elements and their dependencies and sort
   * them in an order where each element required is before
   * the elements that require it.
   * @param elements an array in the form of:
                     [{name:"A"},
                     {name:"B", require:{A:true}},
                     {name:"C", require:{B:true}}]
   * @return the order or an error message
   */
	function topologicalSort(elements) {
		vertices = {}; // hash table of vertices by their name
		order = []; // stack of reverse post-order vertices
		error = null; // store a cycle error if it detects one

		// add one vertex per element in the hash table
		angular.forEach(elements, function(element) {
			vertices[element.name] = {
				adj: [], // will store adjacent vertices names
				marked: false, // store the vertex has been visited by dfs
				onStack: false // to detect cycle
			};
		});

		// add edges between vertices
		// by adding dependent vertices in adjacent list of each vertex
		angular.forEach(elements, function(element) {
			for (var name in element.require) {
				// if required, add the vertex to the adjacent list of the required vertex
				element.require[name] && vertices[name].adj.push(element.name);
			}
		});

		// mark all vertices
		angular.forEach(elements, function(element) {
			// short circuit if cycle found
			if (error) { return; }
			// if this vertex has not been marked by precedent dfs calls, run dfs from it
			vertices[element.name].marked || dfs(element.name);
		});

		return {error:error, order:order, vertices:vertices};
	}

	/**
   * Depth First Search from the source
   * @param source source vertex
   * @private
   */
	function dfs(source) {
		// mark the source vertex
		vertices[source].marked = true;
		// set its onStack to true (to detect cycle)
		vertices[source].onStack = true;
		// for each vertices adjacent to it
		angular.forEach(vertices[source].adj, function(v) {
			// short circuit if cycle error found
			if (error) { return; }
			// if adjacent vertex is not marked
			if (!vertices[v].marked) {
				// recursively run dfs on it
				dfs(v);
			// if it's already onStack
			} else if (vertices[v].onStack) {
				// cycle found, set error
				error = "Error: " + v + " can't require " + source;
			}
		});
		// reset source vertex's onStack to false
		vertices[source].onStack = false;
		// add it to the order stack
		order.unshift(source);
	}

	return topologicalSort;
});