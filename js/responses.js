/**
 * Javascript for the LCDC Questionnaire summary page
 * April 2019 - reb
 */

/**
 * cleanText - given a text field, clean it up by"
 * - removing leading/trailing whitespace
 * - removing duplicate spaces
 * - changing "\n" to "<br />"
 * @param field
 *
 */
function cleanText(field) {
  var retstr = field.trim();
  retstr = retstr.replace(/ +/g, " ");
  retstr = retstr.replace(/\n/g, "<br />");
  return retstr;
}

/**
 * formatScale - take a numeric value, return its human-readable value
 * @param x
 */
function formatScale(x) {
  if (x >= "1" && x <= "5") return satisfactionLabels[x];
  if (x === "") return satisfactionLabels[0];
  return x;
}
/**
 * formatResponse
 * Given an object containing a single response, return a <dl>
 *   with its properties "prettied up"
 * @param resp - the response to format
 * @return "<dl>" with the properties
 */
function formatIndividualResponse(resp) {
  var retstr = "";

  retstr += " <dl>";
  retstr += " <b>Entry Number:</b> " + resp.Response;
  retstr += " <b>Attend Forum:</b> " + formatScale(resp.Attend);
  retstr += " <b>View online:</b>  " + formatScale(resp.View);
  retstr += " <br />";
  retstr += " <b>Municipal Tax Value:</b>  " + formatScale(resp.Muni);
  retstr += " <b>School Tax Value:</b>  " + formatScale(resp.School);
  retstr += " <b>Overall Tax:</b>  " + formatScale(resp.Taxes);
  retstr += " <br />  <br />";
  retstr += "<dt>Takeaway:</dt>  <dd>" + cleanText(resp.Takeaway) + "</dd>";
  retstr += "<dt>Like about Lyme:</dt>  <dd>" + cleanText(resp.Like) + "</dd>";
  retstr +=
    "<dt>Desirable Changes:</dt>  <dd>" + cleanText(resp.Change) + "</dd>";
  retstr +=
    "<dt>How address:</dt>  <dd>" + cleanText(resp["How-address"]) + "</dd>";
  retstr += "<dt>Other thoughts:</dt>  <dd>" + cleanText(resp.Other) + "</dd>";
  retstr += "</dl>";

  return retstr;
}

/**
 * Beginning of main routine
 */

satisfactionLabels = [
  "<i>No entry</i>",
  "Very unsatisfied",
  "Unsatisfied",
  "Neutral",
  "Satisfied",
  "Very satisfied",
];
document.getElementById("ct").innerHTML = responses.length;

var tbody = responses
  .map(function (x) {
    return formatIndividualResponse(x);
  })
  .map(function (x) {
    return "<tr><td>" + x + "</td></tr>";
  });

document.getElementById("resps").innerHTML = "<tbody>" + tbody + "</tbody>";
