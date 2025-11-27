/**
 * Javascript for the LCDC Questionnaire summary page
 * Separating out utility functions
 */

/**
 * tablerow(ary, prop)
 *
 * reduce function that creates text of a table ("<tbody> [<tr><td> stuff </td></tr> ]+ </tbody>")
 *  from the array.
 */
export function tablerow(accum, x) {
  return accum + "<tr><td>" + x + "</td></tr>\n";
}

/**
 * tableize(array, propName, qID)
 * Create a table of the text responses for a question/propName
 * Add it to the page at qID
 * Also fill in the number of responses
 * @param ary - array of the objects that contain each response
 * @param prop - the particular prop to make into a table of text responses
 * @param qID - the question ID that receives the info
 * @returns void
 */
export function tableize(ary, prop, qID) {
  // console.log(`tableize: ${prop} ${qID} ${JSON.stringify(ary[0])}`);
  let theDom = "";

  // check for missing prop
  if (ary[0][prop] === undefined) {
    theDom = `Prop "${prop}" is missing in tablize`;
  } else {
    // Otherwise, we have data
    var theResps = ary
      .map(function (x) {
        return { resp: x[prop], item: x.Response };
      }) // return an object with the requested prop and its Response #
      .map(function (x) {
        return Object.assign(x, { resp: x.resp.trim() });
      }) // remove leading & trailing whitespace from the requested prop
      .filter(function (x) {
        return /\S/.test(x.resp);
      }) // filter out empty strings
      .map(function (x) {
        /* console.log(x.resp); */ return Object.assign(x, {
          resp: x.resp.replace(/\n/g, "<br />"),
        });
      }) // substitute \n with <br />
      .map(function (x) {
        return x.resp + " <i>(Answer #" + x.item + ")</i>";
      }); // append the response # in paren's
    document.getElementById("ct" + qID).innerHTML = theResps.length;

    theDom = theResps.reduce(tablerow, "");
  }
  document.getElementById("r" + qID).innerHTML = theDom;
}

/**
 * summarizeResponseArray()
 * - isolate the heading prop from each response
 * - split on "," if checkboxes
 * - replace ${toStrip} with ""
 * - Count the various occurrences
 * - Return two arrays, labels & counts, sorted by labels
 */
export function summarizeResponseArray(
  responses,
  heading,
  type,
  toStrip,
  minCount,
  sortBy
) {
  // console.log(
  //   `summarizeResponseArray: heading: ${heading} toStrip: "${toStrip}"`
  // );
  const labels = cleanupLabels(responses, heading, type, toStrip);
  console.log(`Count of cleaned-up labels: ${labels.length}`);
  return alphabetizeCounts(labels, minCount, sortBy);
}
/**
 * cleanupLabels() - given the array of response objects,
 *    summarize the particular field's results and return
 *    two arrays: the labels, and the corresponding counts
 * @param array of responses
 * @param heading - the property to examine
 * @param type - If "checkboxes", split on ","
 * @param toStrip - string to remove from labels
 * @returns array of labels
 */

export function cleanupLabels(responses, heading, type, toStrip) {
  let labels = [];

  let allResponses = [];
  responses.forEach((item) => {
    if (type != "checkboxes") {
      allResponses.push(item[heading]);
    } else {
      const pieces = item[heading].split(",");
      allResponses.push(...pieces);
    }
  });

  // console.log(`allResponses: ${JSON.stringify(allResponses)}`);
  // allResponses is an array of the choices made by the user (as strings)
  allResponses.forEach((item) => {
    let val = item.replace(toStrip, "");
    val = val.trim();
    if (val) {
      labels.push(val);
    }
  });
  // console.log(`cleaneduplabels: ${JSON.stringify(labels, null, 2)}`);
  return labels;
}

/**
 * alphabetizeCounts(values, minCount)
 * @param values string[]
 * @param minCount minimum count threshold to keep in main arrays
 * @returns [labels string[], counts number[], other {label,count}[]]
 */
export function alphabetizeCounts(values, minCount = 0, col = "label") {
  const frequency = new Map();
  values.forEach((value) => {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  });

  const sorted = Array.from(frequency.entries());
  sorted.sort((a, b) => {
    if (col === "value") {
      return b[1] - a[1];
    }
    return b[0].localeCompare(a[0]);
  });

  const labels = [];
  const counts = [];
  const other = [];

  sorted.forEach(([label, count]) => {
    if (count <= minCount) {
      other.push(label);
      return;
    }
    labels.push(label);
    counts.push(count);
  });

  console.log(
    `Return from alphabetize: labels=${JSON.stringify(
      labels
    )}\ncounts=${JSON.stringify(counts)} \nother=${JSON.stringify(other)}`
  );
  return [labels, counts, other];
}

/**
 * countResponses
 * @param accum
 * @param x
 * Return an object whose props contain the number of times the prop occurs in the input array.
 */
export function countResponses(accum, x) {
  if (accum[x] === undefined) {
    accum[x] = 0;
  }
  accum[x]++;
  return accum;
}
/**
 * summarizeResponses(ary, prop, init)
 * @ary array to summarize
 * @prop prop to summarize
 * @init starting value (sets all options to zero, to ensure they're shown)
 * Return an object with the total number of each kind of response
 */
export function summarizeResponses(ary, prop, labels) {
  var zeroAry = {};
  labels.forEach(function (x) {
    zeroAry[x] = 0;
  });
  var retary = ary
    .map(function (x) {
      return x[prop];
    })
    .map(function (x) {
      if (x >= "1" && x <= "5") {
        x = labels[x];
      }
      return x;
    })
    .map(function (x) {
      if (x === "") {
        x = "N/A";
      }
      return x;
    }) // Fix up empty string
    .map(function (x) {
      if (x === null) {
        x = "N/A";
      }
      return x;
    }) // Fix up "null"
    .reduce(countResponses, zeroAry);

  return retary;
}

/**
 * pieChart - create a pie chart from the responses
 * @param ary
 * @param prop
 * @param textLabels
 * @param qID
 */
// export function pieChart(ary, prop, textLabels, qID) {
//   //pie
//   var ctxP = document.getElementById("r" + qID).getContext("2d");
//   var resps = summarizeResponses(ary, prop, textLabels);
//   var labels = Object.keys(resps);
//   var data = [];
//   var count = 0;
//   if (ary[0][prop] == undefined) {
//     count = `Prop "${prop}" is missing`;
//   } else {
//     labels.forEach(function (x) {
//       data.push(resps[x]);
//       count += resps[x];
//     });
//   }
//   document.getElementById("ct" + qID).innerHTML = count;

//   var myPieChart = new Chart(ctxP, {
//     type: "pie",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           data: data,
//           // backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
//           backgroundColor: [
//             "rgba(54, 162, 235, 0.2)", // blue
//             "rgba(75, 192, 192, 0.2)", // green
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//           ],
//           hoverBackgroundColor: [
//             "rgba(54, 162, 235, 1)", // blue
//             "rgba(75, 192, 192, 1)", // green
//             "rgba(255,99,132,1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)",
//           ],
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//     },
//   });
// }
/**
 * barChart - create a bar chart with responses
 * @param ary
 * @param prop
 * @param textLabels
 * @param qID
 * @param label
 */
export function barChart(ary, prop, textLabels, qID, label) {
  var ctx = document.getElementById("r" + qID).getContext("2d");
  var resps = summarizeResponses(ary, prop, textLabels);

  var labels = Object.keys(resps);
  var data = [];
  var count = 0;
  if (ary[0][prop] == undefined) {
    count = `Prop ${prop} is missing`;
  } else {
    labels.forEach(function (x) {
      data.push(resps[x]);
      count += resps[x];
    });
  }
  document.getElementById("ct" + qID).innerHTML = count;

  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "",
          data: data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)", // blue
            "rgba(75, 192, 192, 0.2)", // green
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)", // blue
            "rgba(75, 192, 192, 1)", // green
            "rgba(255,99,132,1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

/**
 * cleanText - given a text field, clean it up by"
 * - removing leading/trailing whitespace
 * - removing duplicate spaces
 * - changing "\n" to "<br />"
 * @param field
 *
 */
export function cleanText(field) {
  if (field == undefined) return `Field ${field} is missing`;
  var retstr = field.trim();
  retstr = retstr.replace(/ +/g, " ");
  retstr = retstr.replace(/\n/g, "<br />");
  return retstr;
}

/**
 * formatScale - take a numeric value, return its human-readable value
 * @param x
 */
export function formatScale(x) {
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
export function formatIndividualResponse(resp) {
  function r(respID) {
    if (resp[respID] == undefined) alert(`Bad ID in r(): ${respID}`);
    return resp[respID] || "-";
  }
  var retstr = "";

  retstr += ` <dl>`;
  retstr += `<b>Answer Number:</b> ${resp.Response} <br />`;
  retstr += `<b>Age:</b> ${r("16. Age range")} `;
  retstr += `<b>Years in Lyme:</b> ${r("13. Years in Lyme")} `;
  retstr += ` <b>${r("19. Currently own")}</b>`;
  retstr += `<br /><br />`;
  retstr += `<b>Rate of increase:</b> ${r("1. Rate of increase")} <br />`;
  retstr += `<b>Infill with 4-units?:</b> ${r("9. Infill")}`;
  retstr += `<br /> <br />`;
  retstr += `<dt>Kinds of new construction:</dt>  `;
  retstr += `<dd> Duplex: ${r("2. Duplexes")}; 3-6 units: ${r(
    "2. 3-6 units"
  )}; 7-15 units: ${r("2. 7 to 15 units")}</dd>`;
  retstr += `<b>Affordable</b> ${r("3. Affordable")} <b>Attainable:</b>  ${r(
    "3. Attainable"
  )}`;
  retstr += `<br /> `;
  retstr += `<b>Explanation:</b> ${r("4. Att-Aff Explanation")}	`;
  retstr += `<br /> <br />`;
  retstr += `<dt>Appropriate districts/locations for housing:</dt>  
    <dd> <ul>
      <li>Lyme Common: ${r("5. Lyme Common")}
      <li>Lyme Center: ${r("5. Lyme Center")}
      <li>Commercial: ${r("5. Commercial")}
      <li>Rural: ${r("5. Commercial")}
      <li>East Lyme: ${r("5. East Lyme")}
      <li>Holts Ledge: ${r("5. Holts Ledge")}
      <li>Mtn & Forest: ${r("5. Mtn & Forest")}
      <li>Wherever Single Family: ${r("5. Wherever SF units")}
      <li>Nowhere: ${r("5. Nowhere")}
      </ul>`;
  retstr += `<dt>Other locations:</dt> <dd>${r("6. Other explanation")}	</dd>`;
  retstr += `<dt>Housing in Commercial District:</dt>  <dd>${r(
    "7. Housing in Commercial"
  )}</dd>`;
  retstr += `<dt>Appropriate districts/locations for multi-unit housing:</dt>  
    <dd> ${r("8. Multi-unit districs")}</dd>`;
  // retstr += `<br />`;
  retstr += `<b>Should school capacity in 2040 limit housing options?:</b> ${r(
    "10. Lyme School"
  )} <br />`;
  retstr += `<b>Explanation:</b> ${r("11. Lyme School Explanation")}	`;
  retstr += `<br /><br />`;
  retstr += `<dt>Important Housing Initiatives:</dt>  <dd>${r(
    "12. Housing initiatives"
  )}</dd>`;
  retstr += `<b>Plan to move in 5 years:</b> ${r("14. Plan to move")}	<br />`;
  retstr += `<b>Explanation:</b> ${r("15. Explanation of moving")}	`;
  retstr += `<br /><br />`;

  retstr += `<b>Buy/rent a smalller home?:</b> ${r("17. Smaller house")}	<br />`;
  retstr += `<b>Explanation:</b> ${r("18. Smaller house explanation")}	`;
  retstr += `<br /><br />`;
  retstr += `<b>Other thoughts:</b> ${r("20. Other thoughts")}`;
  retstr += "</dl>";

  return retstr;
}
