const router = require('express').Router();
const Users = require('../Models/userModel');
const checkAuth = require('../Middlewares/checkAuth')

//fetch friends
router.get('/', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo

    try {

        //find user
        let user = await Users.findOne({ email: userDetailsFromToken.email })

        let friends = await Users.find({ "_id": { "$in": user.friends } })

        let friendRequests = await Users.find({ "_id": { "$in": user.friendRequests } })

        let friendsList = friends.map((el) => {
            return {
                email: el.email,
                _id: el._id,
                isOnline: el.isOnline
            }
        })

        let friendRequestsList = friendRequests.map((el) => {
            return {
                email: el.email,
                _id: el._id,
                isOnline: el.isOnline
            }
        })

        //send friends list in json

        res.json({
            status: "success",
            code: 200,
            message: "Friend list found successfully",
            results: {
                friends: friendsList,
                friendRequests : friendRequestsList
            }
        })
    } catch (err) {
        res.status(400).json({ errorMsg: 'Internal server error !' })
    }

})


//search users
router.post('/search', checkAuth, async (req, res) => {

    const searchTerm = req.body.email;

    try {

        let users = await Users.find({ email: { $regex: searchTerm, $options: 'i' } });

        res.json({
            status: "success",
            code: 200,
            message: "User found successfully",
            results: {
                users
            }
        })
    } catch (err) {
        console.log("Error - ", err)
        res.status(400).json({ errorMsg: 'Internal server error !' })
    }
})

//send friend request
router.post('/add-friend', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo

    try {

        //insert u_id to friends document
        let user = await Users.findOneAndUpdate({
            email: userDetailsFromToken.email
        }, {
            $push: {
                sendFriendRequests : req.body.id
            }
        })

        //insert friends u_id to users document
        let userTwo = await Users.findOneAndUpdate({
            _id: req.body.id
        }, {
            $push: {
                friendRequests: user._id
            }
        })

        //send friends list in json
        let sendfriendsRequestsList = [...user.sendFriendRequests, user._id]

        res.json({
            status: "success",
            code: 200,
            message: "Friend request sent, successfully!",
            results: {
                sendRequests: sendfriendsRequestsList
            }
        })
    } catch (err) {
        console.log("Error - ", err)
        res.status(500).json({ errorMsg: 'Internal server error !' });
    }
})


//accept friend request
router.post('/accept-friend-request', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo
    const idOfFriend = req.body.id;

    try {

        //insert u_id to friends document
        let user = await Users.findOne({ email: userDetailsFromToken.email });
        // Check if idOfFriend exists in the friendRequests array
        const friendRequestIndex = user.friendRequests.findIndex((friendId) => friendId == idOfFriend);

        let friend = await Users.findOne({ _id: idOfFriend })
        // Check if idOfFriend exists in the friendRequests array
        const usersId = user._id.toHexString();
        const sendFriendRequestIndex = friend.sendFriendRequests.findIndex((friendId) => friendId == usersId);

        if (friendRequestIndex !== -1 && sendFriendRequestIndex !== -1) {

            // Remove id of Friend from friendRequests
            user.friendRequests.splice(friendRequestIndex, 1);
            // Add idOfFriend to friends
            user.friends.push(idOfFriend);
            // Save the updated user document
            await user.save();

            //Remove id of user from friends send friend request array
            friend.sendFriendRequests.splice(sendFriendRequestIndex, 1)
            // Add users id to friends "friends" arraylist
            friend.friends.push(user._id);
            // Save the updated user document
            await friend.save();

            res.json({
                status: "success",
                code: 200,
                message: "Friend request accepted",
            });

        } else {
            res.status(400).json({
                errorMsg: "Friend request not found",
            });
        }
    } catch (err) {
        console.log("Error - ", err)
        res.status(500).json({ errorMsg: 'Internal server error !' });
    }
})



//reject friend request
router.post('/reject-friend-request', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo
    const idOfFriend = req.body.id;

    try {

        //insert u_id to friends document
        let user = await Users.findOne({ email: userDetailsFromToken.email });
        // Check if idOfFriend exists in the friendRequests array
        const friendRequestIndex = user.friendRequests.findIndex((friendId) => friendId == idOfFriend);

        let friend = await Users.findOne({ _id: idOfFriend })
        // Check if idOfFriend exists in the friendRequests array
        const usersId = user._id.toHexString();
        const sendFriendRequestIndex = friend.sendFriendRequests.findIndex((friendId) => friendId == usersId);

        if (friendRequestIndex !== -1 && sendFriendRequestIndex !== -1) {

            // Remove id of Friend from friendRequests
            user.friendRequests.splice(friendRequestIndex, 1);
            // Save the updated user document
            await user.save();

            //Remove id of user from friends send friend request array
            friend.sendFriendRequests.splice(sendFriendRequestIndex, 1)
            // Save the updated user document
            await friend.save();

            res.json({
                status: "success",
                code: 200,
                message: "Friend request rejected",
            });

        } else {
            res.status(400).json({
                errorMsg: "Friend request not found",
            });
        }
    } catch (err) {
        console.log("Error - ", err)
        res.status(500).json({ errorMsg: 'Internal server error !' });
    }
})


module.exports = router;