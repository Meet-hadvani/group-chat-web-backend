const router = require('express').Router();
const Group = require('../Models/groupModel');
const checkAuth = require('../Middlewares/checkAuth');

//create group
router.post('/create', checkAuth , async (req,res)=>{
    
    //check if user is exist or not
    try{

        let existingGroup = await Group.find({name:req.body.groupName})

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


    try{
        
        let addGroup = await newGroup.save()

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

//fetch users groups
router.get('/',checkAuth, async(req,res)=>{

    try{
    
        let groups = await Group.find({"members":{"$elemMatch":{"email":req.query.email}}})

        res.json({
            status: "success",
            code: 200,
            message: "Your groups fetched",
            result: {groups : groups}
        })
    }catch(err){
        res.status(400).json("error :" + err)
    }
})

//fetch all groups
router.get('/',checkAuth, async (req,res)=>{

    try{

        const groups = await Group.find();

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


// fetch group by id
router.get('/:groupId',checkAuth, async (req,res)=>{
    
    try{
        const group = await Group.findOne({"_id":req.params.groupId})
        res.json({
            status: "success",
            code: 200,
            message: `${group.name} group data fetched successfully`,
            result: {group : group}
        })
    }catch(err){
        res.status(400).json("error :" + err)
    }

})

module.exports = router;
