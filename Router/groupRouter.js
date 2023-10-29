const router = require('express').Router();
const Group = require('../Models/groupModel');
const checkAuth = require('../Middlewares/checkAuth');
const Users = require('../Models/userModel');

//create group
router.post('/create', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo

    //check if group is exist or not
    try {

        let existingGroup = await Group.find({ name: req.body.groupName })

        if (existingGroup.length != 0 && existingGroup[0].name == req.body.groupName) {
            return res.status(200).json({ message: "This group name is already in use" })
        }
    } catch (err) {
        console.log(err)
    }

    let newGroup = new Group({
        name: req.body.groupName,
        createdBy: userDetailsFromToken.id,
        members: [userDetailsFromToken.id]
    })


    try {

        let addGroup = await newGroup.save()

        res.json({
            status: "success",
            code: 200,
            message: "New group created successfully",
            results: {
                name: addGroup.name,
                groupId : addGroup._id,
                date: addGroup.date,
                createdBy: addGroup.createdBy,
                members: addGroup.members
            }
        })
    } catch (err) {
        res.status(400).json("error :" + err)
    }

})

//add members
router.post('/add-member', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo;
    const members = req.body.members;
    const groupId = req.body.groupId;

    //check if group is exist or not
    try {

        let user = await Users.findById(userDetailsFromToken.id);

        //check if member is friend with user
        let isFriend = true;

        for(el in members){
            isFriend =  user.friends.includes(members[el]);
            if(!isFriend) break;
        }

        if (!isFriend) {
            return res.json({
                status: "failed",
                code: 403,
                message: "The user is not friend with some members."
            })
        }

        let group = await Group.findById(groupId);

        /*dont let user add member if he does not created 
        the group user did not created group */
        if (group.createdBy != userDetailsFromToken.id) {
            return res.json({
                status: "failed",
                code: 403,
                message: "Unauthorized access!"
            })
        }

        //insert members id to group document
        let updateGroup = await Group.findOneAndUpdate({
            _id: groupId
        }, {
            $push: {
                members: [...members]
            }
        })

        res.json({
            status: "success",
            code: 200,
            message: "Friend added to group successfully"
        })

    } catch (err) {
        res.json({
            status: "failed",
            code: 400,
            message: "Something went wrong"
        })
    }

})

//remove members
router.post('/remove-member', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo;
    const membersId = req.body.memberId;
    const groupId = req.body.groupId;

    //check if group is exist or not
    try {

        let group = await Group.findById(groupId)

        /*dont let user add member if he does not created 
        the group user did not created group */
        if (group.createdBy != userDetailsFromToken.id) {
            return res.json({
                status: "failed",
                code: 200,
                message: "Unauthorized access!"
            })
        }

        //find index of member from groups member array to splice
        const membersIndex = group.members.findIndex((memberIdFromGroup) => memberIdFromGroup == membersId);

        if (membersIndex !== -1) {

            //remove member from group 
            group.members.splice(membersIndex, 1);

            group.save();

            return res.json({
                status: "success",
                code: 200,
                message: "Member removed from group successfully"
            })

        } else {
            return res.json({
                status: "failed",
                code: 400,
                message: "Member not found",
            });
        }

    } catch (err) {
        res.status(400).json("error :" + err)
    }

})

//fetch users groups
router.get('/', checkAuth, async (req, res) => {

    const userDetailsFromToken = req.userInfo;

    try {

        let groups = await Group.find({ "members": userDetailsFromToken.id });

        res.json({
            status: "success",
            code: 200,
            message: "Your groups fetched",
            result: { groups: groups }
        })
    } catch (err) {
        res.status(400).json("error :" + err)
    }
})


// fetch group by id
router.get('/:groupId', checkAuth, async (req, res) => {

    try {
        const group = await Group.findOne({ "_id": req.params.groupId })
        res.json({
            status: "success",
            code: 200,
            message: `${group.name} group data fetched successfully`,
            result: { group: group }
        })
    } catch (err) {
        res.status(400).json("error :" + err)
    }

})

module.exports = router;
