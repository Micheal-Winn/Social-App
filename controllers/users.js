import User from "../models/User.js"

/*Read */

export const getUser = async(req,res)=> {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({message : err.message})
    }
}

export const getUserFriends = async(req,res)=> {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(user.friends.map((id)=>
            User.findById(id)
        ));

        const formattedfriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath}) => {
                return {_id,firstName,lastName,occupation,location,picturePath}
            });

        res.status(200).json(formattedfriends)
    } catch (err) {
        res.status(404).json({message : err.message})
    }
}


/*Update
    My account
*/

export const addRemoveFriend = async(req,res)=>{
    try {
        const {id,friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id !== friendId);//this means my account(id) has this friend so remove this user (friendId)
            friend.friends = friend.friends.filter((idFriend)=> idFriend !== id)//Also i delete this user so these user must be remove my account(id)
        }else{
            user.friends.push(friendId);
            friend.friends.push(id)
        }

        await user.save();
        await friend.save();

        //this line is checking my fri list which shows  update or remove friend and show me friends info summary including base info
        const friends = await Promise.all(user.friends.map((id)=> User.findById(id)));

        const formattedfriends = friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=> {
                return {_id,firstName,lastName,occupation,location,picturePath}
            }
        );

        res.status(200).json(formattedfriends)

    } catch (err) {
        res.status(404).json({message : err.message})
    }
}