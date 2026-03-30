error_count = 0
verbose = false

function linear_test() {
  result_str = "";
  lin = linear(0,1, 0,100);
  a = lin(0.5);
  if (a == 50) {
    result_str += "lin(0.5) = 50\n"
  } else {
    error_count++;
    result_str += "lin(0.5) != 50\n"
  }
  response = "" + error_count + "errors\n";
  if (verbose) {
    response += result_str;
  }
  return result_str;
}

const test_results = document.getElementById("test-results");

pure_results = document.createElement('p');
pure_results.append(linear_test());

test_results.appendChild(pure_results);
