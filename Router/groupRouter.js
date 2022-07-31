const router = require('express').Router();
const Group = require('../Models/groupModel');
const checkAuth = require('../Middlewares/checkAuth');

//create group
router.post('/create', checkAuth , async (req,res)=>{
    
    //check if user is exist or not
    let existingGroup = await Group.find({name:req.body.groupName})
    try{
        if(existingGroup.length != 0 && existingGroup[0].name == req.body.groupName){
            return res.status(200).json({message : "This group name is already in use"})
        }
    }catch(err){
        console.log(err)
    }

    let newGroup = new Group({
        name : req.body.groupName,
        createdBy : req.body.u_id,
        members : req.body.members
    })

    let addGroup = await newGroup.save()

    try{
        res.json({
            status: "success",
            code: 200,
            message: "New group successfully created",
            results: {
                name : addGroup.name,
                date : addGroup.date,
                createdBy : addGroup.createdBy,
                members : addGroup.members
            }
        })
    }catch(err){
        res.status(400).json("error :" + err)
    }

})

//fetch all groups
router.get('/',checkAuth, async (req,res)=>{

    const groups = await Group.find();

    try{
        res.json({
            status: "success",
            code: 200,
            message: "All groups fetched",
            result: {groups : groups}
        })
    }catch(err){
        res.status(400).json("error :" + err)
    }
})

module.exports = router;