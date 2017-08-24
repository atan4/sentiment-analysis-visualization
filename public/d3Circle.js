//node array necessary for force-directed collision detection.
var nodeArray = [];
 
	var viewportWidth, width = $(window).width();
	var viewportHeight, height = $(window).height();


//-----------------------------------------------------------------------------------
// modular way of drawing circles based on inputs
//-----------------------------------------------------------------------------------
const drawCircle = function(minWidth, frequency, positive, negative, entity){

	//dimensions
	var width = minWidth*frequency;
	console.log("WIDTH IS: " + width);
	var radius = width/2;
	console.log("RADIUS IS: " + radius);
	var posWidth = width*(positive/frequency);
	var negWidth = width*(negative/frequency);
	var name = entity;

	//axis position
	var x = Math.floor((Math.random() * (viewportWidth-200)) + 1);;
	var y = Math.floor((Math.random() * (viewportHeight-200)) + 1);;

	var translateString = "translate("+x+","+y+")";
	var clipUrl = "url(#" + entity.replace(/['"]+/g, '') + ")";
	console.log("THE URL IS: " + clipUrl);
	// console.log("TRANSLATE IS: " + translateString);
	// console.log("translate(571,158)");


	var node = d3.select("body").append("svg")
                          	.attr("width", width)
                            .attr("height", width)
                            .attr("class", "circle");
                            // .attr("transform",translateString);
	//Draw the Circle
	var circle = node.append("clipPath")
							.attr("id", entity)
							.append("ellipse")
	                        .attr("cx", radius)
	                        .attr("cy", radius)
	                        .attr("rx", radius)
	                        .attr("ry", radius);

	//Positive rectangle for clipping
	var posRect = node.append("rect")
							.attr("class","rect")
	                        .attr("clip-path", clipUrl)
	                        .attr("x", 0)
	                        .attr("y", 0)
	                        .attr("width", posWidth)
	                        .attr("height", width)
	                        .style("fill", "#00b1ed");


	//Negative rectangle for clipping
	var negRect = node.append("rect")
							.attr("class","rect")
	                        .attr("x", posWidth)
	                        .attr("y", 0)
	                        .attr("clip-path", clipUrl)	      
	                        .attr("width", negWidth)
	                        .attr("height", width)
	                        .style("fill","red");

	//entity name appended
	var text = node.append("text")                               		
							.text(entity.replace(/_/g, " "))
							.style("font-size",12)
							.style("color","white")
							.attr("class","text")
							.attr("x", radius/3)
							.attr("y", radius);

	nodeArray.push(node);
}

//-----------------------------------------------------------------------------------
//FORCE DIRECTED GRAPH, COLLISION DETECTION
// https://bl.ocks.org/d3indepth/9d9f03a0016bc9df0f13b0d52978c02f
//-----------------------------------------------------------------------------------
var simulation = d3.forceSimulation(nodeArray)


//-----------------------------------------------------------------------------------
//Add click to remove, etc. features
//-----------------------------------------------------------------------------------

