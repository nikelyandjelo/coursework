=====
function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
	}
	
}

function Stop()
{
	clearInterval(timer); //Game stop
	timer = null;
}

function Update() 
{
	spaces[0].Update(spaces[1]);
	spaces[1].Update(spaces[0]);
	if(RandomInteger(0, 10000) > 9700) //Generating new rocket
	{
		objects.push(new Rocket("images/meteorite.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, false, true ));
		objects.push(new Rocket("images/coins.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, true, false ));
	}

	player.Update();

	if(player.dead)
	{
		alert("Вы врезались!!!");
		Stop();
	}

	let isDead = false; 

	for(let i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	let hit = false;

	for(let i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);
		if(hit && objects[i].hitt)
		{
			alert("Вы врезались!!! \n\Ваш счет: " + counter);
			Stop();
			player.dead = true;
			break;
		}
		else if (hit && objects[i].collectable) {
			hit = false;
			objects.splice(i, 1);
			counter+=1;
			console.log(counter);
			
		}
	}

	Draw();
}
let counter = 0;
===
