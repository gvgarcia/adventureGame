function print(text){
	var p = document.createElement('p');
	p.innerHTML = text;
	document.body.appendChild(p);
	p.scrollIntoView();
}

// var matrix = [
// [" ","  "," "," "," ","  "," "," "],
// [" ","P1","W","C"," ","P2","C"," "],
// [" ","  "," "," "," ","  "," "," "],
// [" ","S ","W","C"," ","  "," "," "],
// [" ","C "," "," "," ","  ","C"," "],
// [" ","C ","W"," "," ","  "," "," "],
// [" ","  "," ","C"," ","G "," "," "],
// [" ","  "," "," "," ","  "," "," "]
// ];
//
// for (var i = 0; i < 1; i++) {
//   // matrix.push(new Array(w).fill(Math.random()))
//   console.log(matrix);
// document.write(matrix + " ");
// }

var matrix = [
[" ","  "," "," "," ","  "," "," "],
[" ","P1","W","C"," ","P2","C"," "],
[" ","  "," "," "," ","  "," "," "],
[" ","S ","W","C"," ","  "," "," "],
[" ","C "," "," "," ","  ","C"," "],
[" ","C ","W"," "," ","  "," "," "],
[" ","  "," ","C"," ","G "," "," "],
[" ","  "," "," "," ","  "," "," "]
];
for(i=0;i<64;i++){
		var x = Math.floor(Math.random()*8);
		var y = Math.floor(Math.random()*8);

			if(matrix[x][y]==1){

        if(matrix[y][x]==0){

        	matrix[y][x]=1;

        }else

        	matrix[Math.floor(Math.random()*8)][Math.floor(Math.random()*8)]=1;

        }

        matrix[x][y]=1;
	}

var character = {'inventory': [], 'location': 'west room'};

var dungeon = {
    'west room': {
        'short_description': 'west room',
        'long_description': 'the west end of a sloping east-west passage of barren rock',
        'contents': ['pail of water', 'dragon tooth'],
        'exits': {'east': 'middle room'}
    },
    'east room': {
        'short_description': 'east room',
        'long_description': 'a room of finished stone with high arched ceiling and soaring columns',
        'contents': [],
        'exits': {'west': 'middle room'}
    },
    'middle room': {
        'short_description': 'middle room',
        'long_description': 'the very heart of the dungeon, a windowless chamber lit only by the eerie light of glowing fungi high above',
        'contents': ['golden key', 'spiral hourglass'],
        'exits': {'east': 'east room', 'west': 'west room'}
    }
};

function command_split(str){
	var parts = str.split(/\s+/);
	var command = parts.shift();
	var object = parts.join(' ');
	return [command, object];
}

var room, command, verb, obj;

function remove(array, item){
	var idx = array.indexOf(item);
	if (idx > -1){
		array.splice(idx,1);
	}
}

function tryToMove(room, direction){
    if(room.exits[direction]){
        character.location = room.exits[direction];
        room = dungeon[character.location];
		describe(room);
    }else{
        print('You cannot go that way');
	}
}

function printInventory(){
    print('You are carrying:');
    character['inventory'].forEach(function(item){
        print('&nbsp;&nbsp;&nbsp;&nbsp;', item);
	});
}

function describe(room){
	if(!room.visited){
		print ('you are in ' + room.long_description);
	}else{
		room.visited = true;
		print (room.short_description);
	}
	var exits = Object.keys(room.exits);
	if (exits.length > 1){
		var last_exit = exits.pop();
		print('there are exits to the ' + exits.join(', ') + ' and ' + last_exit);
	}else{
		print('there is an exit to the ' + exits[0]);
	}
    room['contents'].forEach(function(item){
        print('There is a ' + item + ' here');
	});
}

describe(dungeon[character.location]);

function getOneCommand(){
    room = dungeon[character['location']];
    command = command_split(prompt(room['short_description'] + ' > '));
    verb = command[0];
    obj = command[1];
    console.log('verb: ' + verb + ', object: ' + obj);
    if (['east', 'west', 'north', 'south', 'up', 'down', 'in', 'out	'].indexOf(verb) > -1){
		tryToMove(room, verb);
    }else if (verb === 'inventory'){
		printInventory();
	}else if (verb === 'quit'){
        print('Goodbye');
        return;
	}else if (verb === 'take'){
        if (obj === 'all'){
            if (room['contents']){
                room.contents.slice().forEach(function(item){
                    print('You pick up the ' + item);
                    character['inventory'].push(item);
					remove(room['contents'], item);
				});
            }else{
                print('There is nothing to take!');
			}
        }else{
            room['contents'].slice().forEach(function(item){
                if (item.indexOf(obj) > -1){
                    print('You pick up the ' + item)
                    character['inventory'].push(item);
					remove(room['contents'], item);
				}
			});
		}
	}
	setTimeout(getOneCommand, 0);
}
getOneCommand();
