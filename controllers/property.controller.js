const Property=require("../config/models/property.js") ;
const User=require("../config/models/user.js") ;

const mongoose =require("mongoose");
const dotenv =require("dotenv") ;


dotenv.config();


const getAllProperties = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        title_like = "",
        propertyType = "",
    } = req.query;

    const query = {};

    if (propertyType !== "") {
        query.propertyType = propertyType;
    }

    if (title_like) {
        query.title = { $regex: title_like, $options: "i" };
    }

    try {
        const count = await Property.countDocuments({ query });

        const properties = await Property.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyDetail = async (req, res) => {
    const { id } = req.params;
    const propertyExists = await Property.findOne({ _id: id }).populate(
        "creator",
    );

    if (propertyExists) {
        res.status(200).json(propertyExists);
    } else {
        res.status(404).json({ message: "Property not found" });
    }
};


const getOneProperty = async(req, res) => {
    const {id} = req.params
    // get property
    const property = await Property.findById(id)
    if(!property)return res.status(400).send({message: 'Not found'})
    return res.status(200).send({property})
}

const createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            propertyType,
            location,
            price,
            photo,
            email,
        } = req.body;

     
        const user = await User.findOne({ email });

        if (!user) throw new Error("User not found");

        const newProperty = await Property.create({
            title,
            description,
            propertyType,
            location,
            price,
            photo: photo,
            creator: user._id,
        });

        user.allProperties.push(newProperty._id);
        await user.save({ newProperty });

        res.status(200).json({ message: "Property created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, propertyType, location, price, photo } =
            req.body;

        await Property.findByIdAndUpdate(
            { _id: id },
            {
                title,
                description,
                propertyType,
                location,
                price,
                photo: photo,
            },
        );

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const propertyToDelete = await Property.findByIdAndDelete(id).populate(
            "creator",
        );
        if (!propertyToDelete) throw new Error("Property not found");

        propertyToDelete.creator.allProperties.pull(id);
        await propertyToDelete.creator.save();

        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const bookProperty=async(req,res)=>{
 res.json(" Hello") 
}

module.exports = {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    deleteProperty,
    updateProperty,
    getOneProperty,
    bookProperty,
    
};