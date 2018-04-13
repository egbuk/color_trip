var fullScr = false;

function toggleFullScreen() {
    clearCanvas();
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      document.getElementById("toolbar").className = "hidden";
      fullScr = true;
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      document.getElementById("toolbar").className = "";
      fullScr = false;
    }
  }

var steps, radius, cRadius;

function changesteps(that) {
    steps = that.value;
    console.log('steps:'+steps);
}

function changeradius(that) {
    radius = that.value;
    console.log('radius:'+radius);
}

function changeCircleRadius(that) {
    cRadius = that.value;
    console.log('cRadius:'+cRadius);
}

var animate = true;

function changeAnimation(that) {
    animate = that.checked;
}

var m_canvas = document.createElement('canvas');
var ctx = m_canvas.getContext('2d');
    

function save() {
    var image = m_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.getElementById('link');
    link.setAttribute('download', 'AwfulPicture.png');
    link.setAttribute('href', image);
    link.click();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, m_canvas.width, m_canvas.height);
}

function init() {
    steps = 1;
    document.getElementById('stepsSelect').value = steps;
    document.getElementById('changeAnimation').checked = animate;
    cRadius = document.getElementById('cRadiusSelect').value
    radius = document.getElementById('radiusSelect').value
    var canvas = document.getElementById('view');
    var view = canvas.getContext('2d');

    window.onresize = resize;

    setInterval(function() {
        if (steps < 512 && animate) {
            steps *= 2;
            document.getElementById('stepsSelect').value = steps;
        }
    }, 1500);

    function resize(event) {
        if (fullScr) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        } else {
            canvas.height = window.innerHeight - 50;
            canvas.width = window.innerWidth - 4;
        }
        let tmpCanvas = document.createElement('canvas');
        var tctx = tmpCanvas.getContext('2d');
        tmpCanvas.height = m_canvas.height;
        tmpCanvas.width = m_canvas.width;
        tctx.drawImage(m_canvas, 0, 0);
        m_canvas.height = canvas.height;
        m_canvas.width = canvas.width;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tmpCanvas, 0, 0);
    }

    resize();

    var phase = 0, x, y;

    const colorSteps = 300;

    function render() {
        phase++;
        if (phase > colorSteps) {
            phase = 1;
        }
        var i;
        for (i = 1; i <= steps; i++){
            let plus = (i/steps*Math.PI);
            let tmpRadius = (cRadius * Math.cos((phase/colorSteps)*2*Math.PI+plus));
            x = (m_canvas.width / 2) + tmpRadius * Math.cos(plus);
            y = (m_canvas.height / 2) + tmpRadius * Math.sin(plus);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'hsl('+Math.round((phase/colorSteps*360)+(i/steps*360))+',100%,50%)';
            ctx.fill();
        }
        view.drawImage(m_canvas, 0, 0);
        requestAnimationFrame(render);
    }

    render();
    return true;
}