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

// Get Random Color
// Returns a random RGB color 
function getRandomColor() {
  let red = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);
  let colorCode = `#${red.toString(16).padStart(2,"0")}${green.toString(16).padStart(2,"0")}${blue.toString(16).padStart(2,"0")}`
  return (colorCode);
}

//Gets invoked when a new value is selected in the list of values.
function optionChanged(subjectID) {

  //console.log(subjectID);

  //get the samples object from the array for the subjectID passed as parameter.
  var samplesData = allSampleData.samples.filter( sample => {
    return (sample.id === subjectID); 
  }); 

  //console.log(samplesData);
  if (samplesData.length > 0)  {
    buildBarChart(samplesData);
    buildBubbleChart(samplesData);
    buildPanel(allSampleData, subjectID);
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


  function buildBubbleChart(samplesData) { 
    //Build a bubble chart with the samples data.
    // y = sample_values
    // x = otu_ids
    // marker colors = otu_ids
    // marker size   = sample_values
    // text          = otu_labels
    yLabels      = samplesData[0].sample_values;
    xLabels      = samplesData[0].otu_ids;
    markerSizes  = samplesData[0].sample_values;
    markerColors = samplesData[0].otu_ids.map( otu_id => getRandomColor());
    //console.log(markerColors);
    hoverText = samplesData[0].otu_labels;

    let trace1 = {
      x : xLabels,
      y : yLabels,
      mode : "markers",
      marker : { size  : markerSizes,
                 color : markerColors },
      text : hoverText
    }

    let data = [trace1]

    let layout = {
     xaxis: { title: "OTU IDs"},
     yaxis: { title: "Sample Values"},
       title  : `Operational Taxonomic Units`, 
       showlevend: false
    }

    Plotly.newPlot ("bubble", data, layout); 

  }

  function buildPanel(allSamplesData, subjectID) { 
    //Fill the Pane's data area with a table 
    // showing the metadata[] array.

    //console.log(allSamplesData);

    let metaData = allSamplesData.metadata.filter( sample => {
      return (sample.id == subjectID); 
    }); 

    //console.log(metaData);
    
    if (metaData.length > 0) { 

      let id        = metaData[0].id;
      let ethnicity = metaData[0].ethnicity;
      let gender    = metaData[0].gender;
      let age       = metaData[0].age;
      let location  = metaData[0].location;
      let bbtype    = metaData[0].bbtype;
      let wfreq     = metaData[0].wfreq || "Value Not Found";
      // console.log (`${id}, ${ethnicity}, ${gender}, ${age}, ${location}, ${bbtype} , ${wfreq}`);
      
      let table = d3.select("#panel-table");
      table.selectAll("tr").remove();
      let trow;
        trow = table.append("tr");
        trow.append("td").text(` Id : ${id}`);
        trow = table.append("tr");
        trow.append("td").text(`Ethnicity : ${ethnicity}`);
        trow = table.append("tr");
        trow.append("td").text(`Gender : ${gender}`);
        trow = table.append("tr");
        trow.append("td").text(`Age : ${age}`);
        trow = table.append("tr");
        trow.append("td").text(` Location : ${location}`);
        trow = table.append("tr");
        trow.append("td").text(` BB Type : ${bbtype}`);
        trow = table.append("tr");
        trow.append("td").text(` Wash Freq. : ${wfreq}`);
    }

    buildGauge(metaData); 
    
    return(0);
  }

  function buildGauge(metaData) {

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: metaData[0].wfreq,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: { 
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 250], color: "lightgray" },
            { range: [250, 400], color: "gray" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 10
          }
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);
    return(0);
    
  }
 
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
    console.log(">> init(data)");

    //Fill the "selDataset" <select> element with the values from Test Subject IDs.
    idArray = data.metadata.map( subject => subject.id ); 
    //Add a space as the default (first) option.
   // idArray.unshift(" "); 
    let selectElement = d3.select("#selDataset"); 
    idArray.forEach( function(subjectID) {
      selectElement.append("option").text(subjectID); 
    });
    optionChanged(idArray[0].toString());
    //console.log("<< init(data)");
    return (0);
}

//console.log(window.location.pathname);
var allSampleData; 
d3.json("data/samples.json").then(
function(data) {
  allSampleData = data;
  init(allSampleData);
}, 
function(error) {
  alert(`Error fetching data. Make sure the http server is started.`);
  return console.warn(error);
});