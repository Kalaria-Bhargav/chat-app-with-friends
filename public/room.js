let rooms = [{id : "strangers",
pass:"123"},
];



const check = ()=>{
    const roomid = document.getElementById('room').value.trim();
    const password = document.getElementById('Password').value.trim();
    console.log(roomid);
    console.log(password);
    
    for(let i = 0;i<rooms.length;i++){
       
        if(roomid == rooms[i].id){
            if(password != rooms[i].pass){
                return true;
            }
            return false;
        }
    }
    rooms.push({id:roomid, pass :password})
    

    // console.log(rooms);
    return false;
}
function validateMyForm()
{

  if(check())
  { 
    alert("Password is Incorrect");
    return ;
  }

  document.getElementById('myForm').submit();
}


