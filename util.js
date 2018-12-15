import crel from 'crel';


function matrix (filler_value, dimensions) {
    if (!dimensions || dimensions.length == 0) {
      return filler_value;
    } else if (dimensions.length == 1) {
      return Array(dimensions[0]).fill(filler_value);
    } else if (dimensions.length > 1) {
      var a = Array(dimensions[0]).fill(undefined);
      var dim = dimensions.slice(1);
      for (let i in a) {
        a[i] = matrix(filler_value, dim);
      }
      return a;
    }
};

function normalizePage () {
  crel(document.body,
    crel("link", {
        rel: "stylesheet",
        href: "./asset/normalize.css",
    })
  );
};

function assert(name, a, b, testFunc) {
  if (!testFunc(a, b)) {
      console.error(`${name} failed. Got:`, a, "Expected:", b);
  }
}

export {assert, matrix, normalizePage};