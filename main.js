let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

let current_forme = "développée"
let tile_count = zoom

let tab = {
    "développée" : document.getElementById("développée"),
    "canonique" : document.getElementById("canonique"),
    "factorisée" : document.getElementById("factorisée"),
}

function changeTab(forme) {
    tab[current_forme].hidden = true
    tab[forme].hidden = false
    current_forme = forme
}

function round(n) { return Math.round(n * 1000000) / 1000000}
function text(t, x, y) {
    let metrics = ctx.measureText(t)
    let w = metrics.width
    let h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    // ctx.fillRect(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6)
    ctx.clearRect(x - w / 2 - 2, y - h / 2 - 3, w + 4, h + 5)
    // ctx.clearRect(x - w / 2, y - h / 2, w, h)
    ctx.fillText(t, x, y)
}

let fonction = document.getElementById("fonction")
let delta = document.getElementById("delta")
let input_a  = document.getElementById("a")
let input_b  = document.getElementById("b")
let input_c  = document.getElementById("c")
let input_α  = document.getElementById("α")
let input_β  = document.getElementById("β")
let input_x1 = document.getElementById("x1")
let input_x2 = document.getElementById("x2")
let input_zoom = document.getElementById("zoom")

function draw(dt) {
    let Δ = 0
    let VΔ = 0
    let a  = round(input_a.value)
    let b  = round(input_b.value)
    let c  = round(input_c.value)
    let α  = round(input_α.value)
    let β  = round(input_β.value)
    let x1 = round(input_x1.value)
    let x2 = round(input_x2.value)

    switch(current_forme) {
        case "développée":
            Δ  = b*b - 4*a*c
            VΔ = Math.sqrt(Δ)
            α  = input_α.value = round(-(b/(2*a)))
            β  = input_β.value = round(-(Δ/(4*a)))
            x1 = input_x1.value = round((-b-VΔ)/(2*a))
            x2 = input_x2.value = round((-b+VΔ)/(2*a))
            fonction.innerHTML = `f(x) = ${round(a)}x² + ${round(b)}x + ${round(c)}`
            delta.innerHTML = `Δ = ${round(Δ)}`
            break
        case "canonique":
            b  = input_b.value = round(α*-(2*a))
            c  = input_c.value = round(β+(b*b)/(4*a))
            Δ  = b*b - 4*a*c
            VΔ = Math.sqrt(Δ)
            x1 = input_x1.value = round((-b-VΔ)/(2*a))
            x2 = input_x2.value = round((-b+VΔ)/(2*a))
            fonction.innerHTML = `f(x) = ${round(a)}(x - ${round(α)})² + ${round(β)}`
            delta.innerHTML = `Δ = ${round(Δ)}`
            break
        case "factorisée":
            if(x1 != NaN && x2 != NaN) {
                b  = input_b.value = round(-a*(x1+x2))
                c  = input_c.value = round(a*x1*x2)
                Δ  = b*b - 4*a*c
                VΔ = Math.sqrt(Δ)
                α  = input_α.value = round(-(b/(2*a)))
                β  = input_β.value = round(-(Δ/(4*a)))
                if(x1 == x2) fonction.innerHTML = `f(x) = ${round(a)}(x - ${round(x1)})²`
                else fonction.innerHTML = `f(x) = ${round(a)}(x - ${round(x1)})(x - ${round(x2)})`
                delta.innerHTML = `Δ = ${round(Δ)}`
            }
            break
    }

    function calculate(x) { return a*x*x + b*x + c }

    canvas.width = window.innerWidth - 16
    canvas.height = window.innerHeight - 16
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "15px consolas"

    
    let tile_count = input_zoom.value

    let tile_size = Math.max(canvas.height / tile_count, canvas.width / tile_count)
    
    let x_row = canvas.width / tile_size
    let y_row = canvas.height / tile_size
    
    let origin_x = x_row / 2
    let origin_y = y_row / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let x_scale = canvas.width / x_row
    let y_scale = canvas.height / y_row
    let scaled_origin_x = origin_x * x_scale
    let scaled_origin_y = origin_y * y_scale
    let reverse_scaled_origin_y = (y_row - origin_y) * y_scale
    
    ctx.lineWidth = 2
    ctx.strokeStyle = "red"
    ctx.beginPath()
    for(let i = 0; i < canvas.width; i++) {
        let x = i / x_scale - origin_x
        ctx.lineTo(i, scaled_origin_y + calculate(x) * y_scale)
    }
    ctx.stroke()
    
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.moveTo(scaled_origin_x, 0)
    ctx.lineTo(scaled_origin_x, canvas.height)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(0, scaled_origin_y)
    ctx.lineTo(canvas.width, scaled_origin_y)
    ctx.stroke()
    
    ctx.fillStyle = "black"
    ctx.save()
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
    for(let i = 0; i < x_row / 2; i++) {
        text( i, scaled_origin_x + i * x_scale, reverse_scaled_origin_y)
        text(-i, scaled_origin_x - i * x_scale, reverse_scaled_origin_y)
    }
    for(let i = 0; i < y_row / 2; i++) {
        text( i, scaled_origin_x, scaled_origin_y - i * y_scale)
        text(-i, scaled_origin_x, scaled_origin_y + i * y_scale)
    }
    ctx.restore()
    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
