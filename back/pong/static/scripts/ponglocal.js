function runsocket(){
    let url = `ws://${window.location.host}/ws/socket-pong-local/`
    
    const chatSocket = new WebSocket(url);
    
    
    chatSocket.onmessage = function(e){
        let data = JSON.parse(e.data)
        if (data.type == 'connection_established')
        {
            console.log("localpong")
            console.log(data);
        }
        else if (data.type == 'update received')
        {
            paddle_speed = data.data.paddle_speed
            paddle_width = parseInt(data.data.paddle_width)
            paddle_height = parseInt(data.data.paddle_height)
            p1_x_pos = parseFloat(data.data.p1_x_pos)
            p1_y_pos = parseFloat(data.data.p1_y_pos)
            p2_x_pos = parseFloat(data.data.p2_x_pos)
            p2_y_pos = parseFloat(data.data.p2_y_pos)
            p1_score = parseInt(data.data.p1_score)
            p2_score = parseInt(data.data.p2_score)  
            ball_x_pos = parseFloat(data.data.ball_x_pos)
            ball_y_pos = parseFloat(data.data.ball_y_pos)
            ball_width = parseFloat(data.data.ball_width)
            ball_x_velocity = parseFloat(data.data.ball_x_velocity)
            ball_y_velocity = parseFloat(data.data.ball_y_velocity)
            ball_x_normalspeed = parseFloat(data.data.ball_x_normalspeed)
            player1 = data.data.player1
            player2 = data.data.player2
            // console.log('Data:', data)
            // console.log("paddle speed", paddle_speed)
            // console.log("paddle_width", paddle_width)
            // console.log("paddle_height", paddle_height)
            // console.log("p1_x_pos", p1_x_pos)
            // console.log("p1_y_pos", p1_y_pos)
            // console.log("p2_x_pos", p2_x_pos)
            // console.log("p2_y_pos", p2_y_pos)
            // console.log("p1_score", p1_score)
            // console.log("p2_score", p2_score)
            // console.log("ball_x_pos", ball_x_pos)
            // console.log("ball_y_pos", ball_y_pos)
            // console.log("ball_width", ball_width)
            // console.log("ball_x_velocity", ball_x_velocity)
            // console.log("ball_y_velocity", ball_y_velocity)
            // console.log("ball_x_normalspeed", ball_x_normalspeed)
            // console.log("p1ypos", data.data.p1_y_pos)
        }
    }
    
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    
    WIDTH = 600
    HEIGHT = 600
    
    let running = true
    let delay = 30
    
    let paddle_speed = 5
    
    let paddle_width = 10
    let paddle_height = 100
    
    let p1_x_pos = 10
    let p1_y_pos = HEIGHT / 2 - paddle_height / 2
    
    
    let p2_x_pos = WIDTH - paddle_width - 10
    let p2_y_pos = HEIGHT / 2 - paddle_height / 2
    
    let p1_score = 0
    let p2_score = 0
    
    let p1_up = false
    let p1_down = false
    let p2_up = false
    let p2_down = false
    
    let ball_x_pos = WIDTH / 2
    let ball_y_pos = HEIGHT / 2
    let ball_width = 8
    let ball_x_velocity = -1
    let ball_y_velocity = 0
    let ball_x_normalspeed = 1
    let player1 = ""
    let player2 = ""
    
    const canvas = document.getElementById('CanvasLocal');
    
    const ctx = canvas.getContext('2d');
    
    document.addEventListener('keydown', function(event) {
        const key = event.key;
    
        switch(key) {
            case 'z':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_up_pressed'}));
                break;
            case 'w':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_up_pressed'}));
                break;
            case 's':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_down_pressed'}));
                break;
            case 'ArrowUp':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'p2key_up_pressed'}));
                break;
            case 'ArrowDown':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'p2key_down_pressed'}));
                break;
            // case 'space':
            //     if (chatSocket.readyState === WebSocket.OPEN)
            //         chatSocket.send(JSON.stringify({'message': 'replay'}));
            //     break;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        const key = event.key;
    
        switch(key) {
            case 'z':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_up_released'}));
                break;
            case 'w':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_up_released'}));
                break;
            case 's':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'key_down_released'}));
                break;
            case 'ArrowUp':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'p2key_up_released'}));
                break;
            case 'ArrowDown':
                if (chatSocket.readyState === WebSocket.OPEN)
                    chatSocket.send(JSON.stringify({'message': 'p2key_down_released'}));
                break;
        }
    });
    
    function draw_objects(){
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(p1_x_pos,  p1_y_pos, paddle_width, paddle_height);
        ctx.fillRect(p2_x_pos,  p2_y_pos, paddle_width, paddle_height);
        ctx.beginPath();
        ctx.arc(ball_x_pos, ball_y_pos, ball_width, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.font = "45px sans-serif"
        ctx.fillText(p2_score, WIDTH / 4, HEIGHT / 4, 45)
        ctx.fillText(p1_score, WIDTH * 3 / 4, HEIGHT / 4, 45)
        ctx.fillText(player1, WIDTH * 3 / 4, HEIGHT / 8, 90)
        ctx.fillText(player2, WIDTH / 4, HEIGHT / 8, 90)
    
    }
    
    function get_update(){
        if (chatSocket.readyState === WebSocket.OPEN)
            chatSocket.send(JSON.stringify({'message': 'update'}));
    }
    
    function draw(){
        if (running){
            draw_objects()
            get_update()
            requestAnimationFrame(draw);
        }
    }
    
    draw();
    }
    runsocket()