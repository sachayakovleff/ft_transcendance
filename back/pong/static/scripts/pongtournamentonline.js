

function runsocket(){
    let url = `wss://${window.location.host}/ws/socket-pong-tournament-online/`;
    
    const chatSocket = new WebSocket(url);
    
    let running = true;


    let data = null
    let latestData = null;
    setInterval(() => {
        console.log(latestData);
        console.log(data);
        latestData = null;
    }, 1000); 

    chatSocket.onmessage = function(e){
        data = JSON.parse(e.data)
        if (data.type == 'connection_established')
            console.log(data);
        else if (data.type == 'update received')
        {
            if (data.data.game_data)
            {
                latestData = data.data.game_data
                paddle_speed = data.data.game_data.paddle_speed
                paddle_width = parseInt(data.data.game_data.paddle_width)
                paddle_height = parseInt(data.data.game_data.paddle_height)
                p1_x_pos = parseFloat(data.data.game_data.p1_x_pos)
                p1_y_pos = parseFloat(data.data.game_data.p1_y_pos)
                p2_x_pos = parseFloat(data.data.game_data.p2_x_pos)
                p2_y_pos = parseFloat(data.data.game_data.p2_y_pos)
                p1_score = parseInt(data.data.game_data.p1_score)
                p2_score = parseInt(data.data.game_data.p2_score)  
                ball_x_pos = parseFloat(data.data.game_data.ball_x_pos)
                ball_y_pos = parseFloat(data.data.game_data.ball_y_pos)
                ball_width = parseFloat(data.data.game_data.ball_width)
                ball_x_velocity = parseFloat(data.data.game_data.ball_x_velocity)
                ball_y_velocity = parseFloat(data.data.game_data.ball_y_velocity)
                ball_x_normalspeed = parseFloat(data.data.game_data.ball_x_normalspeed)
                player1 = data.data.game_data.player1
                player2 = data.data.game_data.player2
            }
            if (data.data.tournament && data.data.tournament.is_finished == true)
                running = false
        }   
    }
    
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    
    WIDTH = 600
    HEIGHT = 600
    
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
    
    const canvas = document.getElementById('CanvasTourOnline');
    
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
        if (data && data.data && data.data.tournament.status === "Waiting") // debut du tournois demarage
        {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = "center"
            message = "Tournament starts in: " + data.data.tournament.timer
            ctx.fillText(message, WIDTH/2, HEIGHT/2)
        }
        else if (data && data.data && data.data.tournament.timer >= 0) //entre chaque match
        {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = "center"
            message = "Next match starts in: " + data.data.tournament.timer
            ctx.fillText(message, WIDTH/2, HEIGHT/2)
        }
        else    //pendant le match
        {
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
    }
    
    function get_update(){

        if (chatSocket.readyState === WebSocket.OPEN){
            chatSocket.send(JSON.stringify({'message': 'update'}));
        }
    }
    
    setInterval(() => {
        get_update()
    }, 10);

    function draw(){
        if (running){
            draw_objects()
            requestAnimationFrame(draw);
        }
        else //fin du tournois
        {
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.textAlign = "center"
            ctx.fillText("Tournament finished", WIDTH/2, HEIGHT/2)
            let win_message
            win_message = data.data.tournament.winner + " won the tournament"
            ctx.fillStyle = 'white'
            ctx.fillText(win_message, WIDTH/2 + 40, HEIGHT/2 +40)
        }
    }
    
    draw();
    }
    runsocket()
