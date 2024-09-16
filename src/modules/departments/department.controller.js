import { departmentModel } from "../../../DB/models/department.model.js";
import { customAlphabet } from 'nanoid'
import cloudinary from '../../utilities/cloudinaryConfig.js' 
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)


// Create a new department
export const createDepartment = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, description } = req.body;
    const { file } = req;

    console.log(file);
    

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Upload the image to Cloudinary
    const customId = nanoid()
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: `Hospital/Department/${customId}` // Folder structure in Cloudinary
    });

    // Extract the Cloudinary URL and public ID
    const { secure_url, public_id } = uploadResult;

    // Create a new department instance with the uploaded image URL
    const department = new departmentModel({
      name,
      description,
      imageUrl: secure_url, // Save Cloudinary image URL
      imagePublicId: public_id // Save Cloudinary image public ID for future reference
    });

    // Save the department to the database
    await department.save();

    // Respond with success message and department details
    res.status(201).json({
      message: 'Department added successfully',
      department
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.find();
    res.status(200).json({message:"success", departments});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentModel.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({message:"success",department});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a department by ID
export const updateDepartment = async (req, res) => {
  try {
    const department = await departmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({message:"department updated successfully", department});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a department by ID
export const deleteDepartment = async (req, res) => {
  try {
    const department = await departmentModel.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
