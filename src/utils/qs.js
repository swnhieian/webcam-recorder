// let qs = (function (a) {
//   console.log("in qs:" + window.location.href)
//   if (a === "") return {};
//   var b = {};
//   for (var i = 0; i < a.length; ++i) {
//     var p = a[i].split('=', 2);
//     if (p.length === 1)
//       b[p[0]] = "";
//     else
//       b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
//   }
//   return b;
// })(window.location.search.substr(1).split('&'));

let qs = function(id) {
  let parsedUrl = new URL(window.location.href);
  if (parsedUrl.searchParams.has(id)) {
    return parsedUrl.searchParams.get(id);
  } else {
    return false;
  }
}
export default qs;