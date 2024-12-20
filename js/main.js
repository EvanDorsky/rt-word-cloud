(
  function() {
    document.addEventListener("DOMContentLoaded", main)
  }
)()

var text = "The medium is the message"

function boundedBox() {
    let nodes, sizes
    let bounds
    let size;// = constant([0, 0])

    function force() {
        let node, size
        let xi, x0, x1, yi, y0, y1
        let i = -1
        while (++i < nodes.length) {
            node = nodes[i]
            size = sizes[i]
            xi = node.x + node.vx
            x0 = bounds[0][0] - xi
            x1 = bounds[1][0] - (xi + size[0])
            yi = node.y + node.vy
            y0 = bounds[0][1] - yi
            y1 = bounds[1][1] - (yi + size[1])
            if (x0 > 0 || x1 < 0) {
                node.x += node.vx
                node.vx = -node.vx
                if (node.vx < x0) { node.x += x0 - node.vx }
                if (node.vx > x1) { node.x += x1 - node.vx }
            }
            if (y0 > 0 || y1 < 0) {
                node.y += node.vy
                node.vy = -node.vy
                if (node.vy < y0) { node.vy += y0 - node.vy }
                if (node.vy > y1) { node.vy += y1 - node.vy }
            }
        }
    }

    force.initialize = function (_) {
        sizes = (nodes = _).map(size)
    }

    force.bounds = function (_) {
        return (arguments.length ? (bounds = _, force) : bounds)
    }

    force.size = function (_) {
        return (arguments.length
             ? (size = typeof _ === 'function' ? _ : constant(_), force)
             : size)
    }

    return force
}

function constant(_) {
    return function () { return _ }
}

function rectCollide() {
  let size = constant([0, 0]);
    let nodes,sizes,masses;
    let strength = 1;
    let iterations = 1;
    let nodeCenterX;
    let nodeMass;
    let nodeCenterY;

  function force() {

    let node;
      let i = -1;
      while (++i < iterations){iterate();}
    function iterate(){
          let quadtree = d3.quadtree(nodes, xCenter, yCenter);
          let j = -1

          while (++j < nodes.length){
            node = nodes[j];
            nodeMass = masses[j];
            nodeCenterX = xCenter(node);
            nodeCenterY = yCenter(node);
            quadtree.visit(collisionDetection);
            }//end nodes loop
        }//end iterate function
    function collisionDetection(quad, x0, y0, x1, y1) {
        let updated = false;
        let data = quad.data;
        if(data){
          if (data.index > node.index) {
            let xSize = (node.width + data.width) / 2;
            let ySize = (node.height + data.height) / 2;
            let dataCenterX = xCenter(data);
            let dataCenterY = yCenter(data);
            let dx = nodeCenterX - dataCenterX;
            let dy = nodeCenterY - dataCenterY;
            let absX = Math.abs(dx);
            let absY = Math.abs(dy);
            let xDiff = absX - xSize;
            let yDiff = absY - ySize;
            if(xDiff < 0 && yDiff < 0){
              //collision has occurred
              //overlap x
              let sx = xSize - absX;
              //overlap y
              let sy = ySize - absY;

              if(sx < sy){
                //x displacement smaller than y
                if(sx > 0){
                  sy = 0;
                }
              }else{
                //y displacement smaller than x
                if(sy > 0){
                  sx = 0;
                }
              }
              if (dx < 0){
                //change sign of sx - has collided on the right(?)
                sx = -sx;
              }
              if(dy < 0){
                //change sign of sy - 
                sy = -sy;
              }
              //magnitude of vector
              let distance = Math.sqrt(sx*sx + sy*sy);
              //direction vector/unit vector - normalize each component by the magnitude to get the direction
              let vCollisionNorm = {x: sx / distance, y: sy / distance};
              let vRelativeVelocity = {x: data.vx - node.vx, y: data.vy - node.vy};
              //dot product of relative velocity and collision normal
              let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;     
              if (speed < 0){
                      //negative speed = rectangles moving away
              }else{
                //takes into account mass
                var collisionImpulse = 2*speed / (masses[data.index] + masses[node.index]);
                if(Math.abs(xDiff) < Math.abs(yDiff)){
                    //x overlap is less
                    data.vx -= (collisionImpulse * masses[node.index] * vCollisionNorm.x);
                    node.vx += (collisionImpulse * masses[data.index] * vCollisionNorm.x);
                  }else{
                    //y overlap is less
                    data.vy -= (collisionImpulse * masses[node.index] * vCollisionNorm.y);
                    node.vy += (collisionImpulse * masses[data.index] * vCollisionNorm.y);
                  }
                updated = true;
              }
            }
          }
        }
      return updated
  }
  }//end force

  function xCenter(d) { return d.x + d.vx + sizes[d.index][0] / 2 }
  function yCenter(d) { return d.y + d.vy + sizes[d.index][1] / 2 }

  force.initialize = function (_) {
      sizes = (nodes = _).map(d => [d.width,d.height])
      masses = sizes.map(d => d[0] * d[1])
  }

force.size = function (_) {
        return (arguments.length
             ? (size = typeof _ === 'function' ? _ : constant(_), force)
             : size)
    }

force.strength = function (_) {
    return (arguments.length ? (strength = +_, force) : strength)
    }

force.iterations = function (_) {
    return (arguments.length ? (iterations = +_, force) : iterations)
    }

return force
}//end rectCollide

function fontSize(r) {
  return r*2
}

function textSizeInfo(d) {
  const res = ctx.measureText(d.text)
  return res
}

function elRadius(d) {
  ctx.font = `bold ${fontSize(d.r)}px sans-serif`
  const s = textSizeInfo(d)
  return s.width/2
}

function addWord(word) {
  // find the node (if it exists)
  console.log(1)
  const node = window.nodes.find(d => d.text == word)
  console.log(2)
  // if it doesn't exist, create it with size 1
  if (node) {
    console.log(3)
    node.size = node.size+1
    node.r = node.size*10
    // todo: width and height
    console.log('node size after')
    console.log(node.size)
  } else {
    console.log(4)
    const newNode = createNode({
      size: 1,
      text: word
    })
    console.log(5)
    window.nodes.push(newNode)
  }
  window.simulation.nodes(window.nodes)

  window.simulation.force("x").initialize(window.nodes)
  window.simulation.force("y").initialize(window.nodes)
  window.simulation.force("collide").initialize(window.nodes)
  window.simulation.alpha(1)
  window.simulation.restart()
  // window.simulation.on("tick")()
  console.log('done')
}

function createNode(d) {
  const node = {
    size: d.size,
    r: d.size*10,
    text: d.text,
    // width: textSizeInfo(d).width,
    // height: fontSize(d.size*10),
    x: Math.random()*250-120,
    y: Math.random()*20-10
  }
  return node
}

function main() {
  // element setup

  const canvas = document.getElementById("main")

  const width  = canvas.getBoundingClientRect().width
  const height  = canvas.getBoundingClientRect().height

  window.ctx = canvas.getContext('2d')
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  document.getElementById("input").addEventListener("input", e => {
    if (e.data === " ") {
      const word = e.target.value.trim().toLowerCase()
      e.target.value = ""
      addWord(word)
    }
  })

  const sim = d3.forceSimulation()

  // create word cloud input
  const size = group => group.length // Given a grouping of words, returns the size factor for that 
  const word = d => d // Given an item of the data array, returns the word
  const marginTop = 0 // top margin, in pixels
  const marginRight = 0 // right margin, in pixels
  const marginBottom = 0 // bottom margin, in pixels
  const marginLeft = 0 // left margin, in pixels
  const maxWords = 250 // maximum number of words to extract from the text
  const fontFamily = "sans-serif" // font family
  const fontScale = 15 // base font size
  const fill = null // text color, can be a constant or a function of the word
  const padding = 0 // amount of padding between the words (in pixels)
  const rotate = 0 // a constant or function to rotate the words

  const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  
  const data = d3.rollups(words, size, w => w.toLowerCase())
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({text: word(key), size}));

  window.nodes = data.map(d => createNode(d))

  // do the simulation

  // let collisionForce = rectCollide()
  //   .size(function(d){ return [d.width,d.height] });
  
  // let boxForce = boundedBox()
  //   .bounds([[0, 0], [width, height]])
  //   .size(function (d) { return [d.width, d.height] })

  window.simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force("x", d3.forceX().strength(0.02))
    .force("y", d3.forceY().strength(0.02))
    .force("collide", d3.forceCollide().radius(d => elRadius(d)).iterations(2))
    // https://observablehq.com/@lvngd/rectangular-collision-detection
    // .force('box', boxForce)
    // .force('collision', collisionForce)
    .nodes(window.nodes)
    .on("tick", ticked)

  // invalidation.then(() => simulation.stop())

  function ticked() {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.beginPath()
    for (const d of nodes) {
      ctx.moveTo(d.x + d.r, d.y)
      ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI)
    }
    // ctx.strokeStyle = "#333"
    // ctx.stroke()

    ctx.fillStyle = "#000"
    for (const d of window.nodes) {
      ctx.font = `${fontSize(d.r)}px sans-serif`
      ctx.fillText(d.text, d.x, d.y)
    }
    ctx.restore()
  }
}