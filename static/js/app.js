/**
 * Helper function to select data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

//Gets invoked when a new value is selected in the list of values.
function optionChanged(subjectID) {
  //get the samples object from the array for the subjectID passed as parameter.
  var samplesData = allSampleData.samples.filter( sample => {
    return (sample.id === subjectID); 
  }); 

  // //Sort descending
  // var oneSubjectData = samplesData[0].sample_values.sort(function sortFunction({sample_values:a}, {sample_values:b}) {
  //   return a - b;
  // });

  //console.log(samplesData);
  if (samplesData.length > 0)  {
    buildBarChart(samplesData);
  }
  }

  function buildBarChart(samplesData) { 
    //Build a horizontal bar char with the samples data.
    // x = sample_values
    // y = otu_ids
    // text = otu_labels
    yLabels = samplesData[0].otu_ids.slice(0, 11).map(otu_id => `OTU ${otu_id}`);
    hoverText = samplesData[0].otu_labels.slice(0, 11);
    let trace1 = {
      x : samplesData[0].sample_values.slice(0, 11).reverse(),
      y : yLabels.reverse(),
      text : hoverText.reverse(),
      type : "bar",
      orientation : "h"
    }

    let data = [trace1]

    // let layout = {
    //   title  : "OTUs", 
    //   xaxis  : { title : "Values"}, 
    //   yaxis  : { title : "OTU Id"}
    // }

    Plotly.newPlot ("bar", data); 

  }
 // samplesData[0].otu_ids.forEach( (otuId, index, array) => {
 //   console.log (`OTU ID: ${otuId}, Value : ${samplesData[0].sample_values[index]}, Label:${samplesData[0].otu_labels[index]}`);
 //});

//   sortedSampleValues = samplesData[0].sample_values.sort( (a,b) => parseInt(b) - parseInt(a) );
 
//  var trace1 = {
//   x: sortedSampleValues.slice(0,10);
//   y: reversedData.map(object => object.greekName),
//   text: reversedData.map(object => object.greekName),
//   name: "Greek",
//   type: "bar",
//   orientation: "h"
// };

//   console.log (samplesData); 
//   console.log(sortedOtuIds);
  

  // d3.json(queryUrl).then(function(data) {
  //   // @TODO: Unpack the dates, open, high, low, close, and volume
  //   var dates = unpack(data.dataset.data, 0);
  //   var closingPrices = unpack(data.dataset.data, 4);
  //   var highPrices = unpack(data.dataset.data, 2);
  //   var openPrices = unpack(data.dataset.data, 1);
  //   var lowPrices = unpack(data.dataset.data, 3);
  //   var volume    = unpack(data.dataset.data, 5);
  //   buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  // });

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function init(data) {

    //Fill the "selDataset" <select> element with the values from Test Subject IDs.
    idArray = data.metadata.map( subject => subject.id ); 
    //Add a space as the default (first) option.
    idArray.unshift(" "); 
    let selectElement = d3.select("#selDataset"); 
    idArray.forEach( function(subjectID) {
      selectElement.append("option").text(subjectID); 
    });

    return (0);

    //Grab Name, Stock, Start Date, and End Date from the response json object to build the plots
    var name      = data.dataset.name;
    var stock     = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate   = data.dataset.end_date;

    // @TODO: Unpack the dates, open, high, low, and close prices
    var dates         = unpack(data.dataset.data, 0);
    var closingPrices = unpack(data.dataset.data, 4);
    var highPrices    = unpack(data.dataset.data, 2);
    var openPrices    = unpack(data.dataset.data, 1);
    var highPrices    = unpack(data.dataset.data, 2);
    var lowPrices     = unpack(data.dataset.data, 3);
    var volume        = unpack(data.dataset.data, 5);

    getMonthlyData();

    // Closing Scatter Line Trace
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
   var trace2 = {
      x: dates,
      close: closingPrices,
      high: highPrices,
      low: lowPrices,
      open: openPrices,
      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y'
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  

}

console.log(window.location.pathname);
var allSampleData; 
d3.json("http://localhost:8000/samples.json").then( function(data) {
    console.log ("Calling init"); 
    init(data);
    allSampleData = data;
});
